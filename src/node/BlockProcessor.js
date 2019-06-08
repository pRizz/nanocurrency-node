"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../secure/Common");
var Voting_1 = require("./Voting");
var moment = require("moment");
var Account_1 = require("../lib/Account");
var UInt256_1 = require("../lib/UInt256");
var WorkValidator_1 = require("../lib/WorkValidator");
// FIXME: audit class
var BlockProcessor = /** @class */ (function () {
    function BlockProcessor() {
    }
    BlockProcessor.prototype.stop = function () {
    };
    BlockProcessor.prototype.flush = function () {
    };
    BlockProcessor.prototype.isFull = function () {
        return false;
    };
    BlockProcessor.prototype.add = function (uncheckedInfo) {
        if (!WorkValidator_1.default.isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())) {
            // TODO: log invalid attempt
            return;
        }
        var blockHash = uncheckedInfo.block.getHash();
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
    };
    BlockProcessor.prototype.addBlock = function (block, origination) {
        var uncheckedInfo = new Common_1.UncheckedInfo({
            block: block,
            account: new Account_1.default(new UInt256_1.default(null)),
            modified: origination,
            signatureVerification: Common_1.SignatureVerification.unknown
        });
        this.add(uncheckedInfo);
    };
    BlockProcessor.prototype.force = function (block) {
    };
    BlockProcessor.prototype.shouldLog = function (should) {
        return false;
    };
    BlockProcessor.prototype.haveBlocks = function () {
        return false;
    };
    BlockProcessor.prototype.processBlocks = function () {
    };
    BlockProcessor.prototype.processOne = function (transaction, uncheckedInfo) {
        return new Common_1.ProcessReturn();
    };
    BlockProcessor.prototype.processOneBlock = function (transaction, block) {
        return new Common_1.ProcessReturn();
    };
    BlockProcessor.prototype.getVoteGenerator = function () {
        return new Voting_1.VoteGenerator();
    };
    BlockProcessor.confirmationRequestDelay = moment.duration(500, 'ms');
    return BlockProcessor;
}());
exports.default = BlockProcessor;
//# sourceMappingURL=BlockProcessor.js.map