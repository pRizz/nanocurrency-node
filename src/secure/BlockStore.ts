import {BlockType} from "../lib/Block";
import BlockHash from "../lib/BlockHash";
import {Endpoint, Equatable} from '../node/Common'
import {MDBValueInterface} from '../node/LMDB'

export interface Transaction {
    getHandle(): any
    finalize(): void // maps to C++ destructor; must call when done with transaction; workaround for not having a destructor
}

export class ReadTransaction implements Transaction {
    constructor(
        private readonly readTransactionImpl: ReadTransactionImpl
    ) {}

    getHandle(): any {
        // TODO
    }

    finalize(): void {
        // TODO
    }
}

export class WriteTransaction implements Transaction {
    constructor(
        private readonly writeTransactionImpl: WriteTransactionImpl
    ) {}

    getHandle(): any {
        // TODO
    }

    finalize(): void {
        // TODO
    }
}

export interface TransactionImpl {
    getHandle(): any
}

export interface ReadTransactionImpl extends TransactionImpl {
    reset(): void
    renew(): void
}

export interface WriteTransactionImpl extends TransactionImpl {
    commit(): void
    renew(): void
}

export interface StoreIterator<DBKey, DBValue> extends Equatable<StoreIterator<DBKey, DBValue>> {
    next(): void
    equals(other: StoreIterator<DBKey, DBValue>): boolean
    getCurrent(): [DBKey | undefined, DBValue | undefined]
    getCurrentKey(): DBKey | undefined
    getCurrentValue(): DBValue | undefined
}

export class DBNoValue implements MDBValueInterface, Equatable<DBNoValue> {
    static fromDBBuffer(mdbBuffer: Buffer): DBNoValue {
        return new DBNoValue()
    }

    asBuffer(): Buffer {
        return Buffer.alloc(0)
    }

    getDBSize(): number {
        return 0
    }

    equals(other: DBNoValue): boolean {
        return true
    }
}

export interface BlockStoreInterface {
    txBeginRead(): ReadTransaction
    txBeginWrite(): WriteTransaction
    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean
    peersFromTransaction(transaction: ReadTransaction): Array<Endpoint>
    getPeersBegin(transaction: ReadTransaction): StoreIterator<Endpoint, DBNoValue>
    getPeersEnd(): StoreIterator<Endpoint, DBNoValue>
}
