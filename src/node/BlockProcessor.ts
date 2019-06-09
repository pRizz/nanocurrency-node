import {ProcessReturn, SignatureVerification, UncheckedInfo} from "../secure/Common";
import UInt64 from "../lib/UInt64";
import Block, {BlockType} from "../lib/Block";
import {Transaction} from "../secure/BlockStore";
import {VoteGenerator} from "./Voting";
import {Duration} from "moment";
import Account from "../lib/Account";
import UInt256 from "../lib/UInt256";
import WorkValidator from "../lib/WorkValidator";
import BlockHash from "../lib/BlockHash";
import moment = require("moment");

// TODO: implement
class RolledHashContainer {
    has(blockHash: BlockHash): boolean {
        return false
    }
}

// TODO: Optimize
class BlockHashSet {
    private set = new Set<string>()

    add(blockHash: BlockHash) {
        this.set.add(blockHash.value.value.toString('hex'))
    }

    has(blockHash: BlockHash): boolean {
        return this.set.has(blockHash.value.value.toString('hex'))
    }
}

class RolledHash {
    blockHash: BlockHash
    // timePoint
}

// FIXME: audit class
export default class BlockProcessor {
    static readonly rolledBackMax = 1024
    static readonly confirmationRequestDelay: Duration = moment.duration(500, 'ms')

    readonly blockHashSet = new BlockHashSet()
    readonly rolledBackHashes = new RolledHashContainer()
    readonly stateBlocks = new Array<UncheckedInfo>()
    readonly nonStateBlocks = new Array<UncheckedInfo>()

    stop() {

    }

    flush() {

    }

    isFull(): boolean {
        return false
    }

    add(uncheckedInfo: UncheckedInfo) {
        // TODO: Optimize; why not check the set first; checking if the work is valid is more expensive
        if(!WorkValidator.isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())) {
            // TODO: log invalid attempt
            return
        }

        const blockHash = uncheckedInfo.block.getHash()

        if(this.blockHashSet.has(blockHash)) {
            return
        }

        if(this.rolledBackHashes.has(blockHash)) {
            return
        }

        if(uncheckedInfo.signatureVerification === SignatureVerification.unknown &&
            (
                uncheckedInfo.block.getBlockType() === BlockType.state ||
                    uncheckedInfo.block.getBlockType() === BlockType.open ||
                    !uncheckedInfo.account.isZero()
            )
        ) {
            this.stateBlocks.push(uncheckedInfo)
        } else {
            this.nonStateBlocks.push(uncheckedInfo)
        }
        this.blockHashSet.add(blockHash)
    }

    addBlock(block: Block, origination: UInt64) {
        const uncheckedInfo = new UncheckedInfo({
            block,
            account: new Account(new UInt256(null)), // FIXME: seems dirty
            modified: origination,
            signatureVerification: SignatureVerification.unknown
        })
        this.add(uncheckedInfo)
    }

    force(block: Block) {

    }

    shouldLog(should: boolean): boolean {
        return false
    }

    haveBlocks(): boolean {
        return false
    }

    processBlocks() {

    }

    processOne(transaction: Transaction, uncheckedInfo: UncheckedInfo): ProcessReturn {
        return new ProcessReturn()
    }

    processOneBlock(transaction: Transaction, block: Block): ProcessReturn {
        return new ProcessReturn()
    }

    getVoteGenerator(): VoteGenerator {
        return new VoteGenerator()
    }
}
