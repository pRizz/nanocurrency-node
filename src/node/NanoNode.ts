import BlockProcessor from "./BlockProcessor";
import {BlockStore, BlockStoreInterface} from "../secure/BlockStore";
import Ledger from "../secure/Ledger";

export default class NanoNode {
    private readonly blockProcessor: BlockProcessor
    readonly blockStore: BlockStoreInterface
    readonly ledger: Ledger

    constructor() {
        this.blockProcessor = new BlockProcessor(this)
        this.blockStore = new BlockStore()
        this.ledger = new Ledger(this.blockStore)
    }
}
