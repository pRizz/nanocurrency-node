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
var BlockProcessor_1 = require("./BlockProcessor");
var BlockStore_1 = require("../secure/BlockStore");
var Ledger_1 = require("../secure/Ledger");
var moment = require("moment");
var Voting_1 = require("./Voting");
var Wallet_1 = require("./Wallet");
var BlockArrival = /** @class */ (function () {
    function BlockArrival() {
    }
    BlockArrival.prototype.add = function (block) {
        return false; // TODO
    };
    return BlockArrival;
}());
var NanoNode = /** @class */ (function () {
    function NanoNode() {
        this.blockArrival = new BlockArrival();
        this.votesCache = new Voting_1.VotesCache();
        this.wallets = new Wallet_1.Wallets();
        this.activeTransactions = new ActiveTransactions();
        this.blockProcessor = new BlockProcessor_1.default(this);
        this.blockStore = new BlockStore_1.BlockStore();
        this.ledger = new Ledger_1.default(this.blockStore);
    }
    NanoNode.prototype.processBlock = function (block) {
        this.blockArrival.add(block);
        this.blockProcessor.addBlock(block, moment());
    };
    NanoNode.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return this.ledger.blockStore.doesBlockExist(transaction, blockType, blockHash);
    };
    NanoNode.prototype.getEpochSigner = function () {
        return this.ledger.getEpochSigner();
    };
    NanoNode.prototype.isEpochLink = function (link) {
        return this.ledger.isEpochLink(link);
    };
    NanoNode.prototype.txBeginRead = function () {
        return this.blockStore.txBeginRead();
    };
    NanoNode.prototype.txBeginWrite = function () {
        return this.blockStore.txBeginWrite();
    };
    NanoNode.prototype.successorFrom = function (transaction, qualifiedRoot) {
        return this.ledger.successorFrom(transaction, qualifiedRoot);
    };
    NanoNode.prototype.rollback = function (transaction, blockHash, rollbackList) {
        this.ledger.rollback(transaction, blockHash, rollbackList);
    };
    NanoNode.prototype.removeRollbackList = function (rollbackList) {
        var e_1, _a;
        try {
            for (var rollbackList_1 = __values(rollbackList), rollbackList_1_1 = rollbackList_1.next(); !rollbackList_1_1.done; rollbackList_1_1 = rollbackList_1.next()) {
                var block = rollbackList_1_1.value;
                this.votesCache.remove(block.getHash());
                this.wallets.workWatcher.remove(block);
                this.activeTransactions.erase(block);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rollbackList_1_1 && !rollbackList_1_1.done && (_a = rollbackList_1.return)) _a.call(rollbackList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return NanoNode;
}());
exports.default = NanoNode;
var ActiveTransactions = /** @class */ (function () {
    function ActiveTransactions() {
    }
    // TODO
    ActiveTransactions.prototype.erase = function (block) {
    };
    return ActiveTransactions;
}());
//# sourceMappingURL=NanoNode.js.map