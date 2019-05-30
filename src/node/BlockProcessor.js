"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../secure/Common");
var Voting_1 = require("./Voting");
var moment = require("moment");
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
    };
    // FIXME: better name for num
    BlockProcessor.prototype.addBlock = function (block, num) {
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