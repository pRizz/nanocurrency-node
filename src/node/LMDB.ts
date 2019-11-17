import {
    BlockStoreInterface,
    DBNoValue,
    ReadTransaction,
    ReadTransactionImpl,
    StoreIterator,
    Transaction,
    TransactionImpl,
    WriteTransaction,
    WriteTransactionImpl
} from '../secure/BlockStore'
import Block, {BlockType} from '../lib/Block'
import BlockHash from '../lib/BlockHash'
import {Endpoint, Equatable, UDPEndpoint} from './Common'
import * as path from 'path'
import {promises as fs} from 'fs'
import * as moment from 'moment'
import {Duration} from 'moment'
import {TXNTrackingConfig} from './DiagnosticsConfig'
import {MDBTXNTracker} from './LMDBTXNTracker'
import UInt256 from '../lib/UInt256'
import {BlockCounts, Epoch} from '../secure/Common'

const lmdb = require('node-lmdb')

export class MDBEnv {
    private tx: any | undefined

    static async create(dbPath: string, maxDBs: number = 128, mapSize: number = 128 * 1024 * 1024 * 1024): Promise<MDBEnv> {
        await this.configureParentPath(dbPath)

        const lmdbEnvironment = new lmdb.Env()
        lmdbEnvironment.open({
            path: dbPath,
            maxDbs: maxDBs,
            mapSize,
            noSubdir: true,
            // TODO: no MDB_NORDAHEAD flag available; C++ project has this flag
            // TODO: no mode option available; defaults to 0664; C++ project uses 0600
        })

        return new MDBEnv(lmdbEnvironment)
    }

    private constructor(readonly lmdbEnvironment: any) {}

    private static async configureParentPath(pathName: string): Promise<void> {
        const parentDirectory = path.dirname(pathName)
        await fs.chmod(parentDirectory, 0o700)
        // FIXME: try mkdir too
    }

    txBeginRead(mdbTXNCallbacks: MDBTXNCallbacks): ReadTransaction {
        return new ReadTransaction(new ReadMDBTXN(this, mdbTXNCallbacks))
    }

    txBeginWrite(mdbTXNCallbacks: MDBTXNCallbacks): WriteTransaction {
        return new WriteTransaction(new WriteMDBTXN(this, mdbTXNCallbacks))
    }

    getTX(): any | undefined {
        return this.tx
    }
}

export class ReadMDBTXN implements ReadTransactionImpl {
    private readonly mdbTXNHandle: any

    constructor(
        mdbEnv: MDBEnv,
        private readonly mdbTXNCallbacks: MDBTXNCallbacks
    ) {
        this.mdbTXNHandle = mdbEnv.lmdbEnvironment.beginTxn()
        mdbTXNCallbacks.txnStart(this)
    }

    getHandle(): any {
        return this.mdbTXNHandle
    }

    renew(): void {
        this.mdbTXNHandle.renew()
        this.mdbTXNCallbacks.txnStart(this)
    }

    reset(): void {
        this.mdbTXNHandle.reset()
        this.mdbTXNCallbacks.txnEnd(this)
    }
}

class WriteMDBTXN implements WriteTransactionImpl {
    constructor(
        private readonly environment: MDBEnv,
        private readonly mdbTXNCallbacks: MDBTXNCallbacks
    ) {
        this.renew()
    }

    getHandle(): any {
        throw 0 // FIXME
    }

    commit(): void {
        throw 0 // FIXME
    }

    renew(): void {
        throw 0 // FIXME
    }
}

class MDBTXNCallbacks {
    constructor(
        readonly txnStart: (transactionImpl: TransactionImpl) => void = () => {},
        readonly txnEnd: (transactionImpl: TransactionImpl) => void = () => {}
    ) {}
}

export class MDBIterator<DBKey extends MDBValueInterface<DBKey>, SomeMDBValue extends MDBValueInterface<SomeMDBValue>> implements StoreIterator<DBKey, SomeMDBValue> {
    private dbKey?: DBKey
    private dbValue?: SomeMDBValue

    constructor(
        private readonly cursor: any | null,
        private mdbKeyValueInterfaceConstructible: MDBKeyInterfaceConstructible<DBKey>,
        private mdbValueInterfaceConstructible: MDBValueInterfaceConstructible<SomeMDBValue>
    ) {}

    static from<DBKey extends MDBValueInterface<DBKey>, SomeMDBValue extends MDBValueInterface<SomeMDBValue>>(
        transaction: Transaction,
        db: any,
        mdbVal: DBKey,
        mdbKeyValueInterfaceConstructible: MDBKeyInterfaceConstructible<DBKey>,
        mdbValueInterfaceConstructible: MDBValueInterfaceConstructible<SomeMDBValue>,
        epoch: Epoch = Epoch.unspecified
    ): MDBIterator<DBKey, SomeMDBValue> {

        const cursor = new lmdb.Cursor(transaction.getHandle(), db)

        const iterator = new MDBIterator(cursor, mdbKeyValueInterfaceConstructible, mdbValueInterfaceConstructible)

        iterator.dbKey = mdbVal

        const currentKey = cursor.goToRange(mdbVal)

        if(currentKey === null) {
            iterator.clear()
            return iterator
        }

        const currentValueBuffer: Buffer | null = cursor.getCurrentBinary()
        if(currentValueBuffer !== null) {
            try {
                const currentValue = mdbValueInterfaceConstructible.fromDBBuffer(currentValueBuffer)
            } catch (e) {
                iterator.clear()
            }
        }
        return iterator
    }

    private clear() {
        // FIXME; possibly not needed
    }

    next(): void {
        if(this.cursor === null) {
            return
        }

        const nextKey = this.cursor.goToNext()
        if(nextKey === null) {
            console.log('nextKey is null')
            this.dbKey = undefined
            this.dbValue = undefined
            return
        }

        console.log('nextKey')
        console.log(nextKey)
        console.log('this.cursor')
        console.log(this.cursor)

        this.dbKey = this.mdbKeyValueInterfaceConstructible.fromDBKeyBuffer(nextKey)
        this.dbValue = this.mdbValueInterfaceConstructible.fromDBBuffer(this.cursor.getCurrentBinary())
    }

    equals(other: StoreIterator<DBKey, SomeMDBValue>): boolean {
        return this.keysEqual(other.getCurrentKey()) && this.valuesEqual(other.getCurrentValue())
    }

    private keysEqual(otherKey: DBKey | undefined): boolean {
        if(this.dbKey === undefined) {
            return otherKey === undefined
        }
        if(otherKey === undefined) {
            return false
        }
        return this.dbKey.equals(otherKey)
    }

    private valuesEqual(otherValue: SomeMDBValue | undefined): boolean {
        if(this.dbValue === undefined) {
            return otherValue === undefined
        }
        if(otherValue === undefined) {
            return false
        }
        return this.dbValue.equals(otherValue)
    }

    getCurrent(): [DBKey | undefined, SomeMDBValue | undefined] {
        return [this.dbKey, this.dbValue]
    }

    getCurrentKey(): DBKey | undefined {
        return this.dbKey
    }

    getCurrentValue(): SomeMDBValue | undefined {
        return this.dbValue
    }
}

export class MDBStore implements BlockStoreInterface {
    private static readonly version = 14

    private readonly mdbTXNTracker: MDBTXNTracker
    private peersDB: any
    private metaDB: any
    private uncheckedInfoDB: any
    private sendBlocksDB: any
    private receiveBlocksDB: any
    private openBlocksDB: any
    private changeBlocksDB: any
    private stateBlocksV0DB: any
    private stateBlocksV1DB: any

    static async create(
        dbPath: string,
        maxDBs: number = 128,
        txnTrackingConfig: TXNTrackingConfig = new TXNTrackingConfig(),
        blockProcessorBatchMaxDuration: Duration = moment.duration('5000', 'ms'),
        batchSize: number = 512,
        shouldDropUnchecked: boolean = false
    ): Promise<MDBStore> {
        const mdbEnv = await MDBEnv.create(dbPath, maxDBs)
        return new MDBStore(mdbEnv, txnTrackingConfig.isEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration, batchSize, shouldDropUnchecked)
    }

    private constructor(
        private readonly mdbEnv: MDBEnv,
        private readonly txnTrackingEnabled: boolean,
        txnTrackingConfig: TXNTrackingConfig,
        blockProcessorBatchMaxDuration: Duration,
        batchSize: number,
        shouldDropUnchecked: boolean
    ) {
        this.mdbTXNTracker = new MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration)

        if(this.isFullyUpgraded()) {
            this.openDBs(false)
        } else {
            this.openDBs(true)
            const transaction = this.txBeginWrite()
            this.doUpgrades(transaction, batchSize)
            transaction.finalize()
        }

        if(shouldDropUnchecked) {
            this.clearUnchecked()
        }
    }

    blockRandom(readTransaction: ReadTransaction): Block {
        const blockCounts = this.getBlockCounts(readTransaction)
        let blockIndex = Math.floor(Math.random() * blockCounts.getSum())

        if(blockIndex < blockCounts.send) {
            return this.blockRandomFor(readTransaction, this.sendBlocksDB, SendBlock)
        }
        blockIndex -= blockCounts.send
        if(blockIndex < blockCounts.receive) {
            return this.blockRandomFor(readTransaction, this.receiveBlocksDB)
        }
        blockIndex -= blockCounts.receive
        if(blockIndex < blockCounts.open) {
            return this.blockRandomFor(readTransaction, this.openBlocksDB)
        }
        blockIndex -= blockCounts.open
        if(blockIndex < blockCounts.change) {
            return this.blockRandomFor(readTransaction, this.changeBlocksDB)
        }
        blockIndex -= blockCounts.change
        if(blockIndex < blockCounts.stateV0) {
            return this.blockRandomFor(readTransaction, this.stateBlocksV0DB)
        }
        return this.blockRandomFor(readTransaction, this.stateBlocksV1DB)
    }

    private blockRandomFor<SomeMDBValue extends MDBValueInterface<SomeMDBValue>>(
        transaction: Transaction,
        db: any,
        mdbValueInterfaceConstructible: MDBValueInterfaceConstructible<SomeMDBValue>
    ): Block {
        const blockHash = new BlockHash(UInt256.getRandom())

        const storeIterator = MDBIterator.from(transaction, db, blockHash, BlockHash, mdbValueInterfaceConstructible)
    }

    private getBlockCounts(transaction: Transaction): BlockCounts {
        return new BlockCounts(
            this.getEntryCount(transaction, this.sendBlocksDB),
            this.getEntryCount(transaction, this.receiveBlocksDB),
            this.getEntryCount(transaction, this.openBlocksDB),
            this.getEntryCount(transaction, this.changeBlocksDB),
            this.getEntryCount(transaction, this.stateBlocksV0DB),
            this.getEntryCount(transaction, this.stateBlocksV1DB),
        )
    }

    private getEntryCount(transaction: Transaction, db: any): number {
        const stat = db.stat(transaction)
        return stat.entryCount
    }

    private clearUnchecked() {
        this.uncheckedInfoDB.drop()
    }

    private doUpgrades(writeTransaction: WriteTransaction, batchSize: number) {
        const version = this.versionGet(writeTransaction)

        switch (version) {
            // @ts-ignore
            case 1:
                this.upgradeV1ToV2(writeTransaction)
                /* fall through */
            // @ts-ignore
            case 2:
                this.upgradeV2ToV3(writeTransaction)
                /* fall through */
            // TODO: all cases
            case 14:
                break
            default:
                console.error(`Invalid db version during upgrade: ${version}`)
        }
    }

    private upgradeV1ToV2(transaction: Transaction) {
        // TODO
    }

    private upgradeV2ToV3(transaction: Transaction) {
        // TODO
    }

    private isFullyUpgraded(): boolean {
        let result = false
        const transaction = this.txBeginRead()
        try {
            this.metaDB = this.mdbEnv.lmdbEnvironment.openDBi({
                name: 'meta',
                create: true,
                keyIsBuffer: true
            })
            result = this.versionGet(transaction) === MDBStore.version
            this.metaDB.close()
        } catch (e) {
            console.error(`An error occurred while checking db version`)
        }
        transaction.finalize()
        return result
    }

    private versionGet(transaction: Transaction): number {
        const versionKey = new UInt256({
            hex: `0000000000000000000000000000000000000000000000000000000000000001`
        })

        const resultData: Buffer | null = transaction.getHandle().getBinary(this.metaDB, versionKey.asBuffer())

        let result = 1
        if(resultData !== null) {
            const resultUInt256 = new UInt256({ buffer: resultData })
            result = resultUInt256.asBuffer().readUInt32BE(28) // get last 4 bytes of 32 bytes
        }

        return result
    }

    // throws
    private openDBs(shouldCreate: boolean) {
        this.peersDB = this.mdbEnv.lmdbEnvironment.openDBi({
            name: 'peers',
            create: shouldCreate,
            keyIsBuffer: true
        })
    }

    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean {
        return false // FIXME
    }

    peersFromTransaction(transaction: ReadTransaction): Array<Endpoint> {
        const cursor = new lmdb.Cursor(transaction, this.peersDB)
        const peers = new Array<Endpoint>()

        for(let key = cursor.goToFirst(); key !== null; key = cursor.goToNext()) {
            const udpEndpointBuffer: Buffer = cursor.getCurrentBinary()
            peers.push(UDPEndpoint.fromDB(udpEndpointBuffer))
        }

        return peers
    }

    txBeginRead(): ReadTransaction {
        return this.mdbEnv.txBeginRead(this.createTxnCallbacks())
    }

    private createTxnCallbacks(): MDBTXNCallbacks {
        if(!this.txnTrackingEnabled) {
            return new MDBTXNCallbacks()
        }

        return new MDBTXNCallbacks(
            (transactionImpl: TransactionImpl) => {
                this.mdbTXNTracker.add(transactionImpl)
            },
            (transactionImpl: TransactionImpl) => {
                this.mdbTXNTracker.erase(transactionImpl)
            }
        )
    }

    txBeginWrite(): WriteTransaction {
        return this.mdbEnv.txBeginWrite(this.createTxnCallbacks())
    }

    getPeersBegin(transaction: ReadTransaction): StoreIterator<Endpoint, DBNoValue> {
        const cursor = new lmdb.Cursor(transaction, this.peersDB)
        return new MDBIterator<Endpoint, DBNoValue>(cursor, UDPEndpoint, DBNoValue)
    }

    getPeersEnd(): StoreIterator<Endpoint, DBNoValue> {
        return new MDBIterator<Endpoint, DBNoValue>(null, UDPEndpoint, DBNoValue)
    }
}

export interface MDBValueInterface<Self> extends Equatable<Self> {
    getDBSize(): number
    asBuffer(): Buffer
}

export interface MDBValueInterfaceConstructible<SomeMDBValue extends MDBValueInterface<SomeMDBValue>> {
    fromDBBuffer(mdbBuffer: Buffer): SomeMDBValue
}

export interface MDBKeyInterfaceConstructible<SomeMDBValue extends MDBValueInterface<SomeMDBValue>> {
    fromDBKeyBuffer(keyBuffer: Buffer): SomeMDBValue
}

// maps to MDBVal in C++ project
class MDBValueWrapper<MDBValueType extends MDBValueInterface<MDBValueType>> implements MDBValueInterface<MDBValueWrapper<MDBValueType>> {
    private rawMDBValue: any

    constructor(private value: MDBValueType) {}

    getRawMDBValue(): any {
        return this.rawMDBValue
    }

    getValue(): MDBValueType {
        return this.value
    }

    equals(other: MDBValueWrapper<MDBValueType>): boolean {
        return this.value.equals(other.value) // TODO: audit
    }

    asBuffer(): Buffer {
        return this.value.asBuffer()
    }

    getDBSize(): number {
        return this.value.getDBSize()
    }
}
