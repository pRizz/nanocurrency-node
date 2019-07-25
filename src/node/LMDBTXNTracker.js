"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MDBTXNTracker = /** @class */ (function () {
    function MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration) {
        this.txnTrackingConfig = txnTrackingConfig;
        this.blockProcessorBatchMaxDuration = blockProcessorBatchMaxDuration;
    }
    MDBTXNTracker.prototype.add = function (transactionImpl) {
        throw 0; // FIXME
    };
    MDBTXNTracker.prototype.erase = function (transactionImpl) {
        throw 0; // FIXME
    };
    return MDBTXNTracker;
}());
exports.MDBTXNTracker = MDBTXNTracker;
//# sourceMappingURL=LMDBTXNTracker.js.map