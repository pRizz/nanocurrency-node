"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TXNTrackingConfig = /** @class */ (function () {
    function TXNTrackingConfig() {
        this.isEnabled = false;
    }
    return TXNTrackingConfig;
}());
exports.TXNTrackingConfig = TXNTrackingConfig;
var DiagnosticsConfig = /** @class */ (function () {
    function DiagnosticsConfig() {
        this.txnTrackingConfig = new TXNTrackingConfig();
    }
    return DiagnosticsConfig;
}());
exports.DiagnosticsConfig = DiagnosticsConfig;
//# sourceMappingURL=DiagnosticsConfig.js.map