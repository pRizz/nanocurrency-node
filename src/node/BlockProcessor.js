"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../secure/Common");
var Block_1 = require("../lib/Block");
var Voting_1 = require("./Voting");
var Account_1 = require("../lib/Account");
var UInt256_1 = require("../lib/UInt256");
var WorkValidator_1 = require("../lib/WorkValidator");
var Signatures_1 = require("./Signatures");
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
        this.set.add(blockHash.value.asBuffer().toString('hex'));
    };
    BlockHashSet.prototype.has = function (blockHash) {
        return this.set.has(blockHash.value.asBuffer().toString('hex'));
    };
    return BlockHashSet;
}());
//TODO: implement
var RolledHash = /** @class */ (function () {
    function RolledHash() {
    }
    return RolledHash;
}());
// FIXME: audit class and make unit tests
var BlockProcessor = /** @class */ (function () {
    function BlockProcessor(delegate) {
        this.blockHashSet = new BlockHashSet();
        this.rolledBackHashes = new RolledHashContainer();
        this.stateBlocks = new Array();
        this.nonStateBlocks = new Array();
        this.isStopped = false;
        this.delegate = delegate;
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
            (uncheckedInfo.block.getBlockType() === Block_1.BlockType.state
                || uncheckedInfo.block.getBlockType() === Block_1.BlockType.open
                || !uncheckedInfo.account.isZero())) {
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
            account: new Account_1.default(new UInt256_1.default()),
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
        if (this.isStopped) {
            return;
        }
        this.processBatch();
    };
    BlockProcessor.prototype.processBatch = function () {
        var maxVerificationBatchSize = 100; // FIXME: align with C++ project
        if (this.stateBlocks.length === 0) {
            return;
        }
        var readTransaction = this.delegate.txBeginRead();
        var stateBlockTimerDone = false;
        setTimeout(function () { stateBlockTimerDone = true; }, 2000);
        while (this.stateBlocks.length !== 0 && !stateBlockTimerDone) {
            this.verifyStateBlocks(readTransaction, maxVerificationBatchSize);
        }
    };
    BlockProcessor.prototype.verifyStateBlocks = function (readTransaction, maxVerificationBatchSize) {
        var e_1, _a;
        var uncheckedInfos = new Array();
        for (var i = 0; i < maxVerificationBatchSize && this.stateBlocks.length !== 0; ++i) {
            var stateBlockInfo = this.stateBlocks.shift();
            if (!stateBlockInfo) {
                continue;
            }
            if (this.delegate.doesBlockExist(readTransaction, stateBlockInfo.block.getBlockType(), stateBlockInfo.block.getHash())) {
                continue;
            }
            uncheckedInfos.push(stateBlockInfo);
        }
        var toVerify = this.uncheckedInfosToSignatureVerifiables(uncheckedInfos);
        var verifications = this.verifySignatureVerifiables(toVerify);
        try {
            for (var verifications_1 = __values(verifications), verifications_1_1 = verifications_1.next(); !verifications_1_1.done; verifications_1_1 = verifications_1.next()) {
                var verification = verifications_1_1.value;
                var uncheckedInfo = uncheckedInfos.shift();
                if (!uncheckedInfo) {
                    continue;
                }
                var signatureVerification = this.signatureVerificationForUncheckedInfo(uncheckedInfo, verification);
                if (!signatureVerification) {
                    continue;
                }
                var updatedUncheckedInfo = new Common_1.UncheckedInfo({
                    block: uncheckedInfo.block,
                    modified: uncheckedInfo.modified,
                    account: uncheckedInfo.account,
                    signatureVerification: signatureVerification
                });
                this.nonStateBlocks.push(updatedUncheckedInfo);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (verifications_1_1 && !verifications_1_1.done && (_a = verifications_1.return)) _a.call(verifications_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    BlockProcessor.prototype.signatureVerificationForUncheckedInfo = function (uncheckedInfo, verification) {
        var signatureVerification = null;
        if (!uncheckedInfo.block.getLink().isZero() && this.delegate.isEpochLink(uncheckedInfo.block.getLink().value)) {
            //TODO: audit
            if (verification) {
                signatureVerification = Common_1.SignatureVerification.valid_epoch;
            }
            else {
                signatureVerification = Common_1.SignatureVerification.unknown;
            }
        }
        else if (verification) {
            signatureVerification = Common_1.SignatureVerification.valid;
        }
        return signatureVerification;
    };
    BlockProcessor.prototype.verifySignatureVerifiables = function (signatureVerifiables) {
        return signatureVerifiables.map(Signatures_1.SignatureChecker.verify);
    };
    BlockProcessor.prototype.uncheckedInfosToSignatureVerifiables = function (uncheckedInfos) {
        return uncheckedInfos.map(this.uncheckedInfoToSignatureVerifiable.bind(this));
    };
    BlockProcessor.prototype.uncheckedInfoToSignatureVerifiable = function (uncheckedInfo) {
        var account = uncheckedInfo.block.getAccount();
        if (!uncheckedInfo.block.getLink().isZero() && this.delegate.isEpochLink(uncheckedInfo.block.getLink().value)) {
            account = this.delegate.getEpochSigner();
        }
        else if (!uncheckedInfo.account.isZero()) {
            account = uncheckedInfo.account;
        }
        var signatureVerifiable = {
            message: uncheckedInfo.block.getHash().value.asUint8Array(),
            signature: uncheckedInfo.block.getBlockSignature(),
            publicKey: account.publicKey
        };
        return signatureVerifiable;
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