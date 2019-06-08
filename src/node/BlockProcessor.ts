import {ProcessReturn, SignatureVerification, UncheckedInfo} from "../secure/Common";
import UInt64 from "../lib/UInt64";
import Block from "../lib/Block";
import {Transaction} from "../secure/BlockStore";
import {VoteGenerator} from "./Voting";
import {Duration} from "moment";
import moment = require("moment");
import Account from "../lib/Account";
import UInt256 from "../lib/UInt256";
import WorkValidator from "../lib/WorkValidator";

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
        if(!WorkValidator.isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())) {
            // TODO: log invalid attempt
            return
        }

        const blockHash = uncheckedInfo.block.getHash()

        /**
         *
         * 			auto hash (info_a.block->hash ());
         std::lock_guard<std::mutex> lock (mutex);
         if (blocks_hashes.find (hash) == blocks_hashes.end () && rolled_back.get<1> ().find (hash) == rolled_back.get<1> ().end ())
         {
				if (info_a.verified == nano::signature_verification::unknown && (info_a.block->type () == nano::block_type::state || info_a.block->type () == nano::block_type::open || !info_a.account.is_zero ()))
				{
					state_blocks.push_back (info_a);
				}
				else
				{
					blocks.push_back (info_a);
				}
				blocks_hashes.insert (hash);
			}

         */
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

    static readonly confirmationRequestDelay: Duration = moment.duration(500, 'ms')
}
