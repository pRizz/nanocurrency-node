"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../lib/Config");
var DiagnosticsConfig_1 = require("./DiagnosticsConfig");
var moment = require("moment");
var Common_1 = require("../secure/Common");
var Account_1 = require("../lib/Account");
var UInt256_1 = require("../lib/UInt256");
var ipaddr = require("ipaddr.js");
var WebSocketConfig_1 = require("./WebSocketConfig");
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
        var _a, _b;
        if (peeringPort === void 0) { peeringPort = 0; }
        this.peeringPort = peeringPort;
        this.allowLocalPeers = !Config_1.NetworkConstants.isLiveNetwork();
        this.maxDBs = 128;
        this.diagnosticsConfig = new DiagnosticsConfig_1.DiagnosticsConfig();
        this.blockProcessorBatchMaxTime = moment.duration('5000', 'ms');
        this.enableVoting = false;
        this.preconfiguredRepresentatives = new Array();
        this.preconfiguredPeers = new Array();
        this.networkParams = new Common_1.NetworkParams();
        this.tcpIncomingConnectionsMax = 1024;
        this.externalAddress = ipaddr.IPv6.parse('::');
        this.externalPort = 0;
        this.webSocketConfig = new WebSocketConfig_1.default.Config();
        if (this.peeringPort === 0) {
            this.peeringPort = Common_1.NetworkParams.network.getDefaultNodePort();
        }
        var epochMessage = 'epoch v1 block';
        var epochBlockLinkBuffer = Buffer.alloc(32);
        epochBlockLinkBuffer.write(epochMessage);
        this.epochBlockLink = new UInt256_1.default({ buffer: epochBlockLinkBuffer });
        this.epochBlockSigner = this.networkParams.ledgerConstants.genesisAccount;
        switch (Common_1.NetworkParams.network.currentNetwork) {
            case Config_1.NANONetwork.nanoTestNetwork:
                this.enableVoting = true;
                this.preconfiguredRepresentatives.push(this.networkParams.ledgerConstants.genesisAccount);
                break;
            case Config_1.NANONetwork.nanoBetaNetwork:
                this.preconfiguredPeers.push(NodeConfigConstants.defaultBetaPeerNetwork);
                (_a = this.preconfiguredRepresentatives).push.apply(_a, __spread(NodeConfig.preconfiguredBetaRepresentatives));
                break;
            case Config_1.NANONetwork.nanoLiveNetwork:
                this.preconfiguredPeers.push(NodeConfigConstants.defaultLivePeerNetwork);
                (_b = this.preconfiguredRepresentatives).push.apply(_b, __spread(NodeConfig.preconfiguredLiveRepresentatives));
                break;
        }
    }
    NodeConfig.preconfiguredBetaRepresentativePublicKeyStrings = [
        'A59A47CC4F593E75AE9AD653FDA9358E2F7898D9ACC8C60E80D0495CE20FBA9F',
        '259A4011E6CAD1069A97C02C3C1F2AAA32BC093C8D82EE1334F937A4BE803071',
        '259A40656144FAA16D2A8516F7BE9C74A63C6CA399960EDB747D144ABB0F7ABD',
        '259A40A92FA42E2240805DE8618EC4627F0BA41937160B4CFF7F5335FD1933DF',
        '259A40FF3262E273EC451E873C4CDF8513330425B38860D882A16BCC74DA9B73'
    ];
    NodeConfig.preconfiguredBetaRepresentatives = NodeConfig.preconfiguredBetaRepresentativePublicKeyStrings.map(Account_1.default.fromPublicKeyHex);
    NodeConfig.preconfiguredLiveRepresentativePublicKeyStrings = [
        'A30E0A32ED41C8607AA9212843392E853FCBCB4E7CB194E35C94F07F91DE59EF',
        '67556D31DDFC2A440BF6147501449B4CB9572278D034EE686A6BEE29851681DF',
        '5C2FBB148E006A8E8BA7A75DD86C9FE00C83F5FFDBFD76EAA09531071436B6AF',
        'AE7AC63990DAAAF2A69BF11C913B928844BF5012355456F2F164166464024B29',
        'BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA',
        '2399A083C600AA0572F5E36247D978FCFC840405F8D4B6D33161C0066A55F431',
        '2298FAB7C61058E77EA554CB93EDEEDA0692CBFCC540AB213B2836B29029E23A',
        '3FE80B4BC842E82C1C18ABFEEC47EA989E63953BC82AC411F304D13833D52A56'
    ];
    NodeConfig.preconfiguredLiveRepresentatives = NodeConfig.preconfiguredLiveRepresentativePublicKeyStrings.map(Account_1.default.fromPublicKeyHex);
    return NodeConfig;
}());
exports.NodeConfig = NodeConfig;
//# sourceMappingURL=NodeConfig.js.map