import {BlockType} from "../lib/Block";
import BlockHash from "../lib/BlockHash";

export interface Transaction {

}

export interface ReadTransaction extends Transaction {

}

export interface WriteTransaction extends Transaction {

}

export interface BlockStoreInterface {
    txBeginRead(): ReadTransaction
    txBeginWrite(): WriteTransaction
    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean
}

export class BlockStore implements BlockStoreInterface {

    //TODO: implement
    txBeginRead(): ReadTransaction {
        return {}
    }

    txBeginWrite(): WriteTransaction {
        return {} // FIXME
    }

    //TODO: implement
    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean {
        return false
    }
}
