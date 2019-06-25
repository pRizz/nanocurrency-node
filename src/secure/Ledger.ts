import {BlockStoreInterface} from "./BlockStore";
import UInt256 from '../lib/UInt256'
import Account from '../lib/Account'

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
}
