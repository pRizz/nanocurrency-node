import {
    BlockStoreInterface,
    ReadTransaction, ReadTransactionImpl,
    Transaction,
    TransactionImpl,
    WriteTransaction, WriteTransactionImpl
} from '../secure/BlockStore'
import {BlockType} from '../lib/Block'
import BlockHash from '../lib/BlockHash'
import {Endpoint} from './Common'
import * as path from 'path'
import { promises as fs } from 'fs'
import {Duration} from 'moment'
import {TXNTrackingConfig} from './DiagnosticsConfig'
import {MDBTXNTracker} from './LMDBTXNTracker'
import * as moment from 'moment'
const lmdb = require('node-lmdb')

export class MDBEnv {
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
        // TODO
    }

    commit(): void {
        // TODO
    }

    renew(): void {
        // TODO
    }
}

class MDBTXNCallbacks {
    constructor(
        readonly txnStart: (transactionImpl: TransactionImpl) => void = () => {},
        readonly txnEnd: (transactionImpl: TransactionImpl) => void = () => {}
    ) {}
}

export class MDBStore implements BlockStoreInterface {
    private readonly mdbTXNTracker: MDBTXNTracker

    static async create(
        dbPath: string,
        maxDBs: number = 128,
        txnTrackingConfig: TXNTrackingConfig = new TXNTrackingConfig(),
        blockProcessorBatchMaxDuration: Duration = moment.duration('5000', 'ms')
    ): Promise<MDBStore> {
        const mdbEnv = await MDBEnv.create(dbPath, maxDBs)
        return new MDBStore(mdbEnv, txnTrackingConfig.isEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration)
    }

    private constructor(
        private readonly mdbEnv: MDBEnv,
        private readonly txnTrackingEnabled: boolean,
        txnTrackingConfig: TXNTrackingConfig,
        blockProcessorBatchMaxDuration: Duration
    ) {
        this.mdbTXNTracker = new MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration)
        let isFullyUpgraded = false
        // TODO
    }

    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean {
        return false // FIXME
    }

    peersFromTransaction(transaction: ReadTransaction): Array<Endpoint> {
        return [] // FIXME
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
}
