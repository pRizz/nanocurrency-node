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
var Common_1 = require("./Common");
var moment = require("moment");
var RepCrawler = /** @class */ (function () {
    function RepCrawler(repCrawlerDelegate) {
        this.repCrawlerDelegate = repCrawlerDelegate;
        this.activeBlockHashSet = new Set();
    }
    RepCrawler.prototype.query = function (channel) {
        var peers = [channel];
        this.queryPeers(peers);
    };
    RepCrawler.prototype.queryPeers = function (peers) {
        var e_1, _a;
        var _this = this;
        var readTransaction = this.repCrawlerDelegate.txBeginRead();
        var block = this.repCrawlerDelegate.blockRandom(readTransaction);
        var blockHash = block.getHash();
        if (this.repCrawlerDelegate.isTestNetwork()) {
            for (var i = 0; this.exists(blockHash) && i < 4; ++i) {
                block = this.repCrawlerDelegate.blockRandom(readTransaction);
                blockHash = block.getHash();
            }
        }
        this.add(blockHash);
        try {
            for (var peers_1 = __values(peers), peers_1_1 = peers_1.next(); !peers_1_1.done; peers_1_1 = peers_1.next()) {
                var peer = peers_1_1.value;
                this.onRepRequest(peer);
                var confirmReqMessage = new Common_1.ConfirmReqMessage(block);
                peer.send(confirmReqMessage).catch(function () {
                    console.error(new Date().toISOString() + ": an error occurred while sending confirmReqMessage to peer");
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (peers_1_1 && !peers_1_1.done && (_a = peers_1.return)) _a.call(peers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        setTimeout(function () { _this.remove(blockHash); }, moment.duration(5, 's').asMilliseconds());
        readTransaction.finalize();
    };
    RepCrawler.prototype.remove = function (blockHash) {
        throw 0; // FIXME
    };
    RepCrawler.prototype.onRepRequest = function (channel) {
        throw 0; // FIXME
    };
    RepCrawler.prototype.add = function (blockHash) {
        this.activeBlockHashSet.add(blockHash.toString());
    };
    RepCrawler.prototype.exists = function (blockHash) {
        return this.activeBlockHashSet.has(blockHash.toString());
    };
    RepCrawler.prototype.start = function () {
        throw 0; // FIXME
    };
    return RepCrawler;
}());
exports.default = RepCrawler;
//# sourceMappingURL=RepCrawler.js.map