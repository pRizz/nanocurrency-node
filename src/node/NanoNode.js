"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var BlockProcessor_1 = require("./BlockProcessor");
var Ledger_1 = require("../secure/Ledger");
var Voting_1 = require("./Voting");
var Wallet_1 = require("./Wallet");
var Network_1 = require("./Network");
var NodeConfig_1 = require("./NodeConfig");
var Common_1 = require("./Common");
var ipaddr_js_1 = require("ipaddr.js");
var RepCrawler_1 = require("./RepCrawler");
var Bootstrap_1 = require("./Bootstrap");
var PortMapping_1 = require("./PortMapping");
var VoteProcessor_1 = require("./VoteProcessor");
var ConfirmationHeightProcessor_1 = require("./ConfirmationHeightProcessor");
var ActiveTransactions_1 = require("./ActiveTransactions");
var NANOWebSocket = require("./WebSocket");
var Signatures_1 = require("./Signatures");
var WriteDatabaseQueue_1 = require("./WriteDatabaseQueue");
var Config_1 = require("../lib/Config");
var moment = require("moment");
var SQLiteBlockStore_1 = require("./blockStore/SQLiteBlockStore");
var BlockArrival = /** @class */ (function () {
    function BlockArrival() {
    }
    BlockArrival.prototype.add = function (block) {
        return false; // TODO
    };
    return BlockArrival;
}());
var NanoNode = /** @class */ (function () {
    function NanoNode(applicationPath, flags, blockStore, nodeConfig) {
        if (flags === void 0) { flags = new NodeConfig_1.NodeFlags(); }
        this.applicationPath = applicationPath;
        this.flags = flags;
        this.blockStore = blockStore;
        this.nodeConfig = nodeConfig;
        this.blockArrival = new BlockArrival();
        this.votesCache = new Voting_1.VotesCache();
        this.wallets = new Wallet_1.Wallets(); // FIXME: Doesn't really belong in the core node
        this.activeTransactions = new ActiveTransactions_1.ActiveTransactions();
        this.repCrawler = new RepCrawler_1.default(this);
        this.isStopped = false;
        this.writeDatabaseQueue = new WriteDatabaseQueue_1.WriteDatabaseQueue();
        if (this.nodeConfig.webSocketConfig.getIsEnabled()) {
            var endpoint = new Common_1.TCPEndpoint(new Common_1.IPAddress(this.nodeConfig.webSocketConfig.getIPAddress()), this.nodeConfig.webSocketConfig.getPort());
            this.webSocketServer = new NANOWebSocket.default.Listener(this, endpoint);
            this.webSocketServer.run();
        }
        this.blockProcessor = new BlockProcessor_1.default(this);
        this.ledger = new Ledger_1.default(this.blockStore);
        this.applicationPath = applicationPath;
        this.network = new Network_1.Network(flags.disableUDP, this.nodeConfig.peeringPort, this, this);
        this.bootstrapListener = new Bootstrap_1.BootstrapListener(this.nodeConfig.peeringPort, this);
        this.portMapping = new PortMapping_1.PortMapping(this);
        this.voteProcessor = new VoteProcessor_1.VoteProcessor(this);
        this.confirmationHeightProcessor = new ConfirmationHeightProcessor_1.ConfirmationHeightProcessor();
        this.bootstrapInitiator = new Bootstrap_1.BootstrapInitiator(this);
        this.signatureChecker = new Signatures_1.SignatureChecker(nodeConfig.signatureCheckerThreads);
    }
    NanoNode.create = function (applicationPath, flags, nodeConfig) {
        if (flags === void 0) { flags = new NodeConfig_1.NodeFlags(); }
        return __awaiter(this, void 0, void 0, function () {
            var blockStore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SQLiteBlockStore_1.SQLiteBlockStore.from({})];
                    case 1:
                        blockStore = _a.sent();
                        return [2 /*return*/, new NanoNode(applicationPath, flags, blockStore, nodeConfig)];
                }
            });
        });
    };
    NanoNode.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.network.start()];
                    case 1:
                        _a.sent();
                        this.addInitialPeers();
                        if (!this.flags.disableLegacyBootstrap) {
                            this.ongoingBootstrap();
                        }
                        else if (!this.flags.disableUncheckedCleanup) {
                            this.ongoingUncheckedCleanup();
                        }
                        this.ongoingStoreFlush();
                        this.repCrawler.start();
                        this.ongoingRepCalculation();
                        this.ongoingPeerStore();
                        this.ongoingOnlineWeightCalculationQueue();
                        if (this.nodeConfig.tcpIncomingConnectionsMax > 0) {
                            this.bootstrapListener.start();
                        }
                        if (!this.flags.disableBackup) {
                            this.backupWallet();
                        }
                        this.searchPending();
                        if (!this.flags.disableWalletBootstrap) {
                            setTimeout(function () {
                                _this.bootstrapWallet();
                            }, moment.duration(1, 'minute').asMilliseconds());
                        }
                        if (this.nodeConfig.externalAddress.range() !== 'unspecified' && this.nodeConfig.externalPort !== 0) {
                            this.portMapping.start();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NanoNode.prototype.stop = function () {
        if (this.isStopped) {
            return;
        }
        console.log(new Date().toISOString() + ": Node stopping");
        this.blockProcessor.stop();
        this.voteProcessor.stop();
        this.confirmationHeightProcessor.stop();
        this.activeTransactions.stop();
        this.network.stop();
        if (this.webSocketServer) {
            this.webSocketServer.stop();
        }
        this.bootstrapInitiator.stop();
        this.bootstrapListener.stop();
        this.portMapping.stop();
        this.signatureChecker.stop();
        this.wallets.stop();
        this.stats.stop();
        this.writeDatabaseQueue.stop();
    };
    NanoNode.prototype.isTestNetwork = function () {
        return Config_1.NetworkConstants.activeNetwork === Config_1.NANONetwork.nanoTestNetwork;
    };
    NanoNode.prototype.blockRandom = function (readTransaction) {
        return this.blockStore.blockRandom(readTransaction);
    };
    NanoNode.prototype.bootstrapWallet = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.searchPending = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.backupWallet = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingOnlineWeightCalculationQueue = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingPeerStore = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingRepCalculation = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingStoreFlush = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingBootstrap = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.ongoingUncheckedCleanup = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.addInitialPeers = function () {
        var _this = this;
        var transaction = this.blockStore.txBeginRead();
        for (var peerIterator = this.blockStore.getPeersBegin(transaction), endIterator = this.blockStore.getPeersEnd(); !peerIterator.equals(endIterator); peerIterator.next()) {
            var peer = peerIterator.getCurrentKey();
            if (peer === undefined) {
                continue;
            }
            if (this.network.hasReachoutError(peer, this.nodeConfig.allowLocalPeers)) {
                continue;
            }
            this.network.tcpChannels.startTCPConnection(peer, function (channel) {
                _this.network.sendKeepalive(channel);
                _this.repCrawler.query(channel);
            }).catch();
        }
    };
    NanoNode.prototype.getRandomPeers = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.getUDPChannelCount = function () {
        return this.network.udpChannels.getChannelCount();
    };
    NanoNode.prototype.bootstrapPeer = function (protocolVersionMin) {
        throw 0; // FIXME
        return new Common_1.TCPEndpoint(new Common_1.IPAddress(ipaddr_js_1.IPv6.parse('')), 0);
    };
    NanoNode.prototype.startTCPReceiveNodeID = function (channel, endpoint, receiveBuffer, callback) {
        throw 0; // FIXME
    };
    NanoNode.prototype.tcpSocketConnectionFailed = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.getAccountCookieForEndpoint = function (endpoint) {
        throw 0; // FIXME
    };
    NanoNode.prototype.isNodeValid = function (endpoint, nodeID, signature) {
        throw 0; // FIXME
    };
    NanoNode.prototype.getNodeID = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.hasNode = function (nodeID) {
        throw 0; // FIXME
    };
    NanoNode.prototype.hasPeer = function (endpoint, allowLocalPeers) {
        throw 0; // FIXME
    };
    NanoNode.prototype.getPrivateKey = function () {
        throw 0; // FIXME
    };
    NanoNode.prototype.isLocalPeersAllowed = function () {
        return this.nodeConfig.allowLocalPeers;
    };
    NanoNode.prototype.processBlock = function (block) {
        this.blockArrival.add(block);
        this.blockProcessor.addBlock(block, moment());
    };
    NanoNode.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return this.ledger.blockStore.doesBlockExist(transaction, blockType, blockHash);
    };
    NanoNode.prototype.getEpochSigner = function () {
        return this.ledger.getEpochSigner();
    };
    NanoNode.prototype.isEpochLink = function (link) {
        return this.ledger.isEpochLink(link);
    };
    NanoNode.prototype.txBeginRead = function () {
        return this.blockStore.txBeginRead();
    };
    NanoNode.prototype.txBeginWrite = function () {
        return this.blockStore.txBeginWrite();
    };
    NanoNode.prototype.successorFrom = function (transaction, qualifiedRoot) {
        return this.ledger.successorFrom(transaction, qualifiedRoot);
    };
    NanoNode.prototype.rollback = function (transaction, blockHash, rollbackList) {
        this.ledger.rollback(transaction, blockHash, rollbackList);
    };
    NanoNode.prototype.removeRollbackList = function (rollbackList) {
        var e_1, _a;
        try {
            for (var rollbackList_1 = __values(rollbackList), rollbackList_1_1 = rollbackList_1.next(); !rollbackList_1_1.done; rollbackList_1_1 = rollbackList_1.next()) {
                var block = rollbackList_1_1.value;
                this.votesCache.remove(block.getHash());
                this.wallets.workWatcher.remove(block);
                this.activeTransactions.erase(block);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rollbackList_1_1 && !rollbackList_1_1.done && (_a = rollbackList_1.return)) _a.call(rollbackList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return NanoNode;
}());
exports.default = NanoNode;
//# sourceMappingURL=NanoNode.js.map