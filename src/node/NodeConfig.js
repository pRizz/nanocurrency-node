"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../lib/Config");
var NodeFlags = /** @class */ (function () {
    function NodeFlags() {
        this.disableBackup = false;
        this.disableLazyBoostrap = false;
        this.disableLegacyBootstrap = false;
        this.disableWalletBootstrap = false;
        this.disableBoostrapListener = false;
        this.disableTCPRealtime = false;
        this.disableUDP = false;
        this.disableUncheckedCleanup = false;
        this.disableUncheckedDrop = true;
        this.fastBootstrap = false;
        this.delayConfirmationHeightUpdating = false;
        this.sidebandBatchSize = 512;
        this.blockProcessorBatchSize = 0;
        this.blockProcessorFullSize = 65536;
        this.blockProcessorVerificationSize = 0;
    }
    return NodeFlags;
}());
exports.NodeFlags = NodeFlags;
var NodeConfig = /** @class */ (function () {
    function NodeConfig() {
        this.allowLocalPeers = !Config_1.NetworkConstants.isLiveNetwork();
        this.peeringPort = 0;
    }
    return NodeConfig;
}());
exports.NodeConfig = NodeConfig;
//# sourceMappingURL=NodeConfig.js.map