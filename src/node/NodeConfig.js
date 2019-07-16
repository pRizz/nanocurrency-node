"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../lib/Config");
var DiagnosticsConfig_1 = require("./DiagnosticsConfig");
var moment = require("moment");
var Common_1 = require("../secure/Common");
var NodeConfigConstants;
(function (NodeConfigConstants) {
    NodeConfigConstants.preconfiguredPeersKey = 'preconfigured_peers';
    NodeConfigConstants.signatureCheckerThreadsKey = 'signature_checker_threads';
    NodeConfigConstants.powSleepIntervalKey = 'pow_sleep_interval';
    NodeConfigConstants.defaultBetaPeerNetwork = 'peering-beta.nano.org';
    NodeConfigConstants.defaultLivePeerNetwork = 'peering.nano.org';
})(NodeConfigConstants || (NodeConfigConstants = {}));
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
    function NodeConfig(peeringPort) {
        if (peeringPort === void 0) { peeringPort = 0; }
        this.peeringPort = peeringPort;
        this.allowLocalPeers = !Config_1.NetworkConstants.isLiveNetwork();
        this.maxDBs = 128;
        this.diagnosticsConfig = new DiagnosticsConfig_1.DiagnosticsConfig();
        this.blockProcessorBatchMaxTime = moment.duration('5000', 'ms');
        this.enableVoting = false;
        this.preconfiguredRepresentatives = new Array();
        this.networkParams = new Common_1.NetworkParams();
        if (this.peeringPort === 0) {
            this.peeringPort = Common_1.NetworkParams.network.getDefaultNodePort();
        }
        switch (Common_1.NetworkParams.network.currentNetwork) {
            case Config_1.NANONetwork.nanoTestNetwork:
                this.enableVoting = true;
                this.preconfiguredRepresentatives.push(this.networkParams.ledgerConstants.genesisAccount);
                break;
            case Config_1.NANONetwork.nanoBetaNetwork:
            // TODO
            case Config_1.NANONetwork.nanoLiveNetwork:
            // TODO
        }
    }
    return NodeConfig;
}());
exports.NodeConfig = NodeConfig;
//# sourceMappingURL=NodeConfig.js.map