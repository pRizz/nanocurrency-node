"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../secure/Common");
var Block_1 = require("../lib/Block");
var Voting_1 = require("./Voting");
var Account_1 = require("../lib/Account");
var UInt256_1 = require("../lib/UInt256");
var WorkValidator_1 = require("../lib/WorkValidator");
var moment = require("moment");
// TODO: implement
var RolledHashContainer = /** @class */ (function () {
    function RolledHashContainer() {
    }
    RolledHashContainer.prototype.has = function (blockHash) {
        return false;
    };
    return RolledHashContainer;
}());
// TODO: Optimize
var BlockHashSet = /** @class */ (function () {
    function BlockHashSet() {
        this.set = new Set();
    }
    BlockHashSet.prototype.add = function (blockHash) {
        this.set.add(blockHash.value.value.toString('hex'));
    };
    BlockHashSet.prototype.has = function (blockHash) {
        return this.set.has(blockHash.value.value.toString('hex'));
    };
    return BlockHashSet;
}());
var RolledHash = /** @class */ (function () {
    function RolledHash() {
    }
    return RolledHash;
}());
// FIXME: audit class
var BlockProcessor = /** @class */ (function () {
    function BlockProcessor() {
        this.blockHashSet = new BlockHashSet();
        this.rolledBackHashes = new RolledHashContainer();
        this.stateBlocks = new Array();
        this.nonStateBlocks = new Array();
    }
    BlockProcessor.prototype.stop = function () {
    };
    BlockProcessor.prototype.flush = function () {
    };
    BlockProcessor.prototype.isFull = function () {
        return false;
    };
    BlockProcessor.prototype.add = function (uncheckedInfo) {
        // TODO: Optimize; why not check the set first; checking if the work is valid is more expensive
        if (!WorkValidator_1.default.isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())) {
            // TODO: log invalid attempt
            return;
        }
        var blockHash = uncheckedInfo.block.getHash();
        if (this.blockHashSet.has(blockHash)) {
            return;
        }
        if (this.rolledBackHashes.has(blockHash)) {
            return;
        }
        if (uncheckedInfo.signatureVerification === Common_1.SignatureVerification.unknown &&
            (uncheckedInfo.block.getBlockType() === Block_1.BlockType.state ||
                uncheckedInfo.block.getBlockType() === Block_1.BlockType.open ||
                !uncheckedInfo.account.isZero())) {
            this.stateBlocks.push(uncheckedInfo);
        }
        else {
            this.nonStateBlocks.push(uncheckedInfo);
        }
        this.blockHashSet.add(blockHash);
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
    BlockProcessor.rolledBackMax = 1024;
    BlockProcessor.confirmationRequestDelay = moment.duration(500, 'ms');
    return BlockProcessor;
}());
exports.default = BlockProcessor;
//# sourceMappingURL=BlockProcessor.js.map