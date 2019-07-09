"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MDBTXNTracker = /** @class */ (function () {
    function MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration) {
        this.txnTrackingConfig = txnTrackingConfig;
        this.blockProcessorBatchMaxDuration = blockProcessorBatchMaxDuration;
    }
    MDBTXNTracker.prototype.add = function (transactionImpl) {
        // TODO
    };
    MDBTXNTracker.prototype.erase = function (transactionImpl) {
        // TODO
    };
    return MDBTXNTracker;
}());
exports.MDBTXNTracker = MDBTXNTracker;
//# sourceMappingURL=LMDBTXNTracker.js.map