"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("../lib/UInt256");
var Account_1 = require("../lib/Account");
var Ledger = /** @class */ (function () {
    function Ledger(blockStore) {
        this.blockStore = blockStore;
    }
    Ledger.prototype.isEpochLink = function (link) {
        return link.equals(this.getEpochLink());
    };
    Ledger.prototype.getEpochLink = function () {
        return new UInt256_1.default(); // FIXME
    };
    Ledger.prototype.getEpochSigner = function () {
        return new Account_1.default(new UInt256_1.default()); // FIXME
    };
    Ledger.prototype.successorFrom = function (transaction, qualifiedRoot) {
        return; // FIXME
    };
    Ledger.prototype.rollback = function (transaction, blockHash, rollbackList) {
        // TODO
    };
    return Ledger;
}());
exports.default = Ledger;
//# sourceMappingURL=Ledger.js.map