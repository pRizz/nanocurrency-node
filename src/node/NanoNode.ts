import BlockProcessor, {BlockProcessorDelegate} from "./BlockProcessor";
import {BlockStore, BlockStoreInterface, ReadTransaction, Transaction} from "../secure/BlockStore";
import Ledger from "../secure/Ledger";
import Block, {BlockType} from '../lib/Block'
import BlockHash from '../lib/BlockHash'
import Account from '../lib/Account'
import UInt256 from '../lib/UInt256'
import moment = require('moment')

class BlockArrival {
    add(block: Block): boolean {
        return false // TODO
    }
}

export default class NanoNode implements BlockProcessorDelegate {
    private readonly blockProcessor: BlockProcessor
    private readonly blockStore: BlockStoreInterface
    private readonly ledger: Ledger
    private readonly blockArrival = new BlockArrival()

    constructor() {
        this.blockProcessor = new BlockProcessor(this)
        this.blockStore = new BlockStore()
        this.ledger = new Ledger(this.blockStore)
    }

    processBlock(block: Block) {
        this.blockArrival.add(block)
        this.blockProcessor.addBlock(block, moment())
    }

    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean {
        return this.ledger.blockStore.doesBlockExist(transaction, blockType, blockHash)
    }

    getEpochSigner(): Account {
        return this.ledger.getEpochSigner()
    }

    isEpochLink(link: UInt256): boolean {
        return this.ledger.isEpochLink(link)
    }

    txBeginRead(): ReadTransaction {
        return this.blockStore.txBeginRead()
    }
}
