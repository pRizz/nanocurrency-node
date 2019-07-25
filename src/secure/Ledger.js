"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ledger = /** @class */ (function () {
    function Ledger(blockStore) {
        this.blockStore = blockStore;
    }
    Ledger.prototype.isEpochLink = function (link) {
        return link.equals(this.getEpochLink());
    };
    Ledger.prototype.getEpochLink = function () {
        throw 0; // FIXME
    };
    Ledger.prototype.getEpochSigner = function () {
        throw 0; // FIXME
    };
    Ledger.prototype.successorFrom = function (transaction, qualifiedRoot) {
        throw 0; // FIXME
    };
    Ledger.prototype.rollback = function (transaction, blockHash, rollbackList) {
        throw 0; // FIXME
    };
    return Ledger;
}());
exports.default = Ledger;
//# sourceMappingURL=Ledger.js.map