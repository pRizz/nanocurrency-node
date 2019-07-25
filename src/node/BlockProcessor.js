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
var WorkValidator_1 = require("../lib/WorkValidator");
var Signatures_1 = require("./Signatures");
var Common_2 = require("./Common");
var moment = require("moment");
// TODO: implement
var RolledHashContainer = /** @class */ (function () {
    function RolledHashContainer() {
    }
    RolledHashContainer.prototype.has = function (blockHash) {
        throw 0; // FIXME
    };
    // returns success
    RolledHashContainer.prototype.insert = function (rolledHash) {
        throw 0; // FIXME
    };
    RolledHashContainer.prototype.removeBlockHash = function (blockHash) {
        throw 0; // FIXME
    };
    RolledHashContainer.prototype.removeRolledHash = function (rolledHash) {
        throw 0; // FIXME
    };
    RolledHashContainer.prototype.getSize = function () {
        throw 0; // FIXME
    };
    RolledHashContainer.prototype.getFirst = function () {
        throw 0; // FIXME
    };
    return RolledHashContainer;
}());
// TODO: Optimize
var BlockHashSet = /** @class */ (function () {
    function BlockHashSet() {
        this.set = new Set();
    }
    BlockHashSet.prototype.add = function (blockHash) {
        this.set.add(blockHash.toString());
    };
    BlockHashSet.prototype.has = function (blockHash) {
        return this.set.has(blockHash.toString());
    };
    BlockHashSet.prototype.delete = function (blockHash) {
        this.set.delete(blockHash.toString());
    };
    return BlockHashSet;
}());
//TODO: implement
var RolledHash = /** @class */ (function () {
    function RolledHash(blockHash, timePoint) {
        this.blockHash = blockHash;
        this.timePoint = timePoint;
    }
    return RolledHash;
}());
// FIXME: audit class and make unit tests
var BlockProcessor = /** @class */ (function () {
    function BlockProcessor(delegate) {
        this.blockHashSet = new BlockHashSet();
        this.rolledBackHashes = new RolledHashContainer();
        this.stateBlockInfos = new Array();
        this.nonStateBlockInfos = new Array();
        this.forcedBlocks = new Array();
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
        if (!WorkValidator_1.default.isUncheckedInfoValid(uncheckedInfo)) {
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
                || (uncheckedInfo.account && uncheckedInfo.account.isZero()))) {
            this.stateBlockInfos.push(uncheckedInfo);
        }
        else {
            this.nonStateBlockInfos.push(uncheckedInfo);
        }
        this.blockHashSet.add(blockHash);
    };
    BlockProcessor.prototype.addBlock = function (block, origination) {
        var uncheckedInfo = new Common_1.UncheckedInfo({
            block: block,
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
        return this.nonStateBlockInfos.length !== 0 || this.stateBlockInfos.length !== 0 || this.forcedBlocks.length !== 0;
    };
    BlockProcessor.prototype.processBlocks = function () {
        while (!this.isStopped) {
            if (!this.haveBlocks()) {
                break;
            }
            this.processBatch();
        }
    };
    BlockProcessor.prototype.processBatch = function () {
        var maxVerificationBatchSize = 100; // FIXME: align with C++ project
        if (this.stateBlockInfos.length !== 0) {
            var readTransaction = this.delegate.txBeginRead();
            var stateBlockTimerDone_1 = false;
            setTimeout(function () { stateBlockTimerDone_1 = true; }, 2000);
            while (this.stateBlockInfos.length !== 0 && !stateBlockTimerDone_1) {
                this.verifyStateBlocks(readTransaction, maxVerificationBatchSize);
            }
        }
        var writeTransaction = this.delegate.txBeginWrite();
        var firstTime = true;
        var processedBlockCount = 0;
        var processedForcedBlockCount = 0;
        var processingBlocksTimerDone = false;
        setTimeout(function () { processingBlocksTimerDone = true; }, 5000);
        while ((this.nonStateBlockInfos.length !== 0 || this.forcedBlocks.length !== 0)
            && (!processingBlocksTimerDone || processedBlockCount < Common_2.default.blockProcessorBatchSize)) {
            var uncheckedInfo = void 0;
            var force = false;
            if (this.forcedBlocks.length === 0) {
                uncheckedInfo = this.nonStateBlockInfos.shift();
                this.blockHashSet.delete(uncheckedInfo.block.getHash());
            }
            else {
                var firstForcedBlock = this.forcedBlocks.shift();
                uncheckedInfo = new Common_1.UncheckedInfo({
                    signatureVerification: Common_1.SignatureVerification.unknown,
                    block: firstForcedBlock,
                    account: undefined,
                    modified: moment()
                });
                force = true;
                ++processedForcedBlockCount;
            }
            var hash = uncheckedInfo.block.getHash();
            if (force) {
                this.processForcedBatch(writeTransaction, uncheckedInfo, hash);
            }
            ++processedBlockCount;
            this.processOne(writeTransaction, uncheckedInfo);
            if (this.nonStateBlockInfos.length === 0 && this.stateBlockInfos.length !== 0) {
                this.verifyStateBlocks(writeTransaction, 256); // FIXME batch size
            }
        }
    };
    BlockProcessor.prototype.processForcedBatch = function (transaction, uncheckedInfo, blockHash) {
        var successor = this.delegate.successorFrom(transaction, uncheckedInfo.block.getQualifiedRoot());
        if (!successor) {
            return;
        }
        if (successor.getHash().equals(blockHash)) {
            return;
        }
        var rollbackList = new Array();
        this.delegate.rollback(transaction, successor.getHash(), rollbackList);
        var successfulInsertion = this.rolledBackHashes.insert(new RolledHash(successor.getHash(), moment()));
        if (successfulInsertion) {
            this.rolledBackHashes.removeBlockHash(blockHash);
            if (this.rolledBackHashes.getSize() > BlockProcessor.rolledBackMax) {
                this.rolledBackHashes.removeRolledHash(this.rolledBackHashes.getFirst());
            }
        }
        this.delegate.removeRollbackList(rollbackList);
    };
    BlockProcessor.prototype.verifyStateBlocks = function (transaction, maxVerificationBatchSize) {
        var e_1, _a;
        var uncheckedInfos = new Array();
        for (var i = 0; i < maxVerificationBatchSize && this.stateBlockInfos.length !== 0; ++i) {
            var stateBlockInfo = this.stateBlockInfos.shift();
            if (!stateBlockInfo) {
                break;
            }
            if (this.delegate.doesBlockExist(transaction, stateBlockInfo.block.getBlockType(), stateBlockInfo.block.getHash())) {
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
                    break;
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
                this.nonStateBlockInfos.push(updatedUncheckedInfo);
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
        else if (uncheckedInfo.account !== undefined && !uncheckedInfo.account.isZero()) {
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