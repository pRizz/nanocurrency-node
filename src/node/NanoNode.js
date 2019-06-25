"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockProcessor_1 = require("./BlockProcessor");
var BlockStore_1 = require("../secure/BlockStore");
var Ledger_1 = require("../secure/Ledger");
var moment = require("moment");
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
    return NanoNode;
}());
exports.default = NanoNode;
//# sourceMappingURL=NanoNode.js.map