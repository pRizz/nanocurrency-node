import {BlockType} from "../lib/Block";
import BlockHash from "../lib/BlockHash";
import {Endpoint} from '../node/Common'

export interface Transaction {
    getHandle(): any
}

export class ReadTransaction implements Transaction {
    constructor(
        private readonly readTransactionImpl: ReadTransactionImpl
    ) {}

    getHandle(): any {
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

export interface BlockStoreInterface {
    txBeginRead(): ReadTransaction
    txBeginWrite(): WriteTransaction
    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean
    peersFromTransaction(transaction: ReadTransaction): Array<Endpoint>
}
