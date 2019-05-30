import {ProcessReturn, UncheckedInfo} from "../secure/Common";
import UInt64 from "../lib/UInt64";
import Block from "../lib/Block";
import {Transaction} from "../secure/BlockStore";
import {VoteGenerator} from "./Voting";
import {Duration} from "moment";
import moment = require("moment");

// FIXME: audit class
export default class BlockProcessor {
    stop() {

    }

    flush() {

    }

    isFull(): boolean {
        return false
    }

    add(uncheckedInfo: UncheckedInfo) {

    }

    // FIXME: better name for num
    addBlock(block: Block, num: UInt64) {

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

    static readonly confirmationRequestDelay: Duration = moment.duration(500, 'ms')
}
