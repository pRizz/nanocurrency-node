import {BlockStoreInterface, Transaction} from "./BlockStore";
import UInt256 from '../lib/UInt256'
import Account from '../lib/Account'
import {QualifiedRoot} from '../lib/Numbers'
import Block from '../lib/Block'
import BlockHash from '../lib/BlockHash'

export default class Ledger {
    readonly blockStore: BlockStoreInterface

    constructor(blockStore: BlockStoreInterface) {
        this.blockStore = blockStore
    }

    isEpochLink(link: UInt256): boolean {
        return link.equals(this.getEpochLink())
    }

    getEpochLink(): UInt256 {
        return new UInt256() // FIXME
    }

    getEpochSigner(): Account {
        return new Account(new UInt256()) // FIXME
    }

    successorFrom(transaction: Transaction, qualifiedRoot: QualifiedRoot): Block | undefined {
        return // FIXME
    }

    rollback(transaction: Transaction, blockHash: BlockHash, rollbackList: Array<Block>) {
        // TODO
    }
}
