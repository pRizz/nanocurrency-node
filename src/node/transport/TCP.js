"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ChannelTCP = exports.TCPChannels = void 0;
// TODO: audit
var Common_1 = require("../Common");
var Socket_1 = require("../Socket");
var Transport_1 = require("./Transport");
var MessageSigner_1 = require("../../lib/MessageSigner");
var UDP_1 = require("./UDP");
var Bootstrap_1 = require("../Bootstrap");
var moment = require("moment");
var tcpRealtimeProtocolVersionMin = Common_1.default.tcpRealtimeProtocolVersionMin;
var TCPChannels = /** @class */ (function () {
    function TCPChannels(delegate) {
        this.channels = new Set();
        this.attempts = new UDP_1.EndpointConnectionAttempts();
        this.delegate = delegate;
    }
    TCPChannels.prototype.hasReachoutError = function (endpoint) {
        if (this.isEndpointOverloaded(endpoint)) {
            return true;
        }
        if (this.getChannelFor(endpoint) !== undefined) {
            return true;
        }
        if (this.attempts.has(endpoint)) {
            return true;
        }
        // TODO: figure out if attempts.insert is needed here
        return false;
    };
    TCPChannels.prototype.getChannelFor = function (endpoint) {
        return undefined; // FIXME
    };
    TCPChannels.prototype.isEndpointOverloaded = function (endpoint) {
        return this.connectionCountFor(endpoint) >= Transport_1.default.maxPeersPerIP;
    };
    TCPChannels.prototype.connectionCountFor = function (endpoint) {
        return 0; // FIXME
    };
    TCPChannels.prototype.start = function () {
        this.startOngoingKeepalive();
    };
    TCPChannels.prototype.startOngoingKeepalive = function () {
        var _this = this;
        if (this.ongoingKeepaliveTimout) {
            return;
        }
        this.ongoingKeepaliveTimout = setInterval(function () {
            var e_1, _a;
            var keepaliveMessage = new Common_1.KeepaliveMessage(_this.delegate.getRandomPeers());
            var sendList = _this.getChannelsAboveCutoff(10000); // FIXME
            try {
                for (var sendList_1 = __values(sendList), sendList_1_1 = sendList_1.next(); !sendList_1_1.done; sendList_1_1 = sendList_1.next()) {
                    var channel = sendList_1_1.value;
                    channel.sendMessage(keepaliveMessage).catch(function (error) {
                        console.error(new Date().toISOString() + ": an error occurred while sending keepalive message, " + error);
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sendList_1_1 && !sendList_1_1.done && (_a = sendList_1.return)) _a.call(sendList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            _this.connectToKnownUDPPeers();
        }, 100000); // FIXME
    };
    // TODO
    TCPChannels.prototype.connectToKnownUDPPeers = function () {
        var randomCount = Math.min(6, Math.ceil(Math.sqrt(this.delegate.getUDPChannelCount())));
        for (var i = 0; i < randomCount; ++i) {
            var tcpEndpoint = this.delegate.bootstrapPeer(tcpRealtimeProtocolVersionMin);
            if (this.hasChannel(tcpEndpoint)) {
                continue;
            }
            this.startTCPConnection(tcpEndpoint, function () { }).catch(function (error) {
                console.error(new Date().toISOString() + ": an error occurred while starting a TCP connection, " + error);
            });
        }
    };
    TCPChannels.prototype.cookieFromEndpoint = function (endpoint) {
        throw 0; // FIXME
    };
    TCPChannels.prototype.startTCPConnection = function (endpoint, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var socket, tcpChannel, tcpEndpoint, accountCookie, handshakeMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        socket = new Socket_1.Socket(Socket_1.SocketConcurrency.multiWriter);
                        tcpChannel = new ChannelTCP(socket, this.delegate);
                        tcpEndpoint = Transport_1.default.mapEndpointToTCP(endpoint);
                        return [4 /*yield*/, tcpChannel.connect(tcpEndpoint)]; // TODO: refactor; encapsulate socket
                    case 1:
                        _a.sent(); // TODO: refactor; encapsulate socket
                        accountCookie = this.delegate.getAccountCookieForEndpoint(tcpEndpoint);
                        handshakeMessage = Common_1.NodeIDHandshakeMessage.fromQuery(accountCookie.publicKey);
                        return [4 /*yield*/, tcpChannel.sendMessage(handshakeMessage)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.startTCPReceiveNodeID(tcpChannel, tcpEndpoint, callback)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TCPChannels.prototype.startTCPReceiveNodeID = function (tcpChannel, endpoint, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var messageHeader, handshakeMessage, nodeID, signature, response, handshakeMessageResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tcpChannel.readMessageHeader()];
                    case 1:
                        messageHeader = _a.sent();
                        if (messageHeader.messageType !== Common_1.MessageType.node_id_handshake) {
                            throw new Error("Unexpected messageType received from remote node");
                        }
                        if (messageHeader.versionUsing.lessThan(Common_1.default.protocolVersionMin)) {
                            throw new Error("Invalid versionUsing received from remote node");
                        }
                        return [4 /*yield*/, Common_1.NodeIDHandshakeMessage.from(messageHeader, tcpChannel.asReadableMessageStream())];
                    case 2:
                        handshakeMessage = _a.sent();
                        if (!handshakeMessage.response || !handshakeMessage.query) {
                            throw new Error("Missing response or query in TCP connection");
                        }
                        tcpChannel.setNetworkVersion(messageHeader.versionUsing);
                        nodeID = handshakeMessage.response.account;
                        if (!this.delegate.isNodeValid(endpoint, nodeID, handshakeMessage.response.signature)
                            || this.delegate.getNodeID().equals(nodeID)
                            || this.delegate.hasNode(nodeID)) {
                            return [2 /*return*/];
                        }
                        tcpChannel.setNodeID(nodeID);
                        tcpChannel.setLastPacketReceived(moment());
                        signature = MessageSigner_1.default.sign(this.delegate.getPrivateKey(), handshakeMessage.query.asBuffer());
                        response = new Common_1.NodeIDHandshakeMessageResponse(this.delegate.getNodeID(), signature);
                        handshakeMessageResponse = Common_1.NodeIDHandshakeMessage.fromResponse(response);
                        return [4 /*yield*/, tcpChannel.sendMessage(handshakeMessageResponse)];
                    case 3:
                        _a.sent();
                        tcpChannel.setLastPacketSent(moment());
                        this.insertChannel(tcpChannel);
                        callback(tcpChannel);
                        TCPChannels.listenForResponses(tcpChannel);
                        return [2 /*return*/];
                }
            });
        });
    };
    TCPChannels.listenForResponses = function (channel) {
        channel.responseServer = new Bootstrap_1.BootstrapServer(channel.socket);
        channel.responseServer.keepaliveFirst = false;
        channel.responseServer.type = Bootstrap_1.BootstrapServerType.realtime_response_server;
        channel.responseServer.remoteNodeID = channel.getNodeID();
        channel.responseServer.receive();
    };
    TCPChannels.prototype.hasChannelWithEndpoint = function (tcpEndpoint) {
        throw 0; // FIXME
    };
    TCPChannels.prototype.insertChannel = function (tcpChannel) {
        var tcpEndpoint = tcpChannel.getTCPEndpoint();
        if (!tcpEndpoint) {
            return false;
        }
        if (!this.delegate.hasPeer(tcpEndpoint.asUDPEndpoint(), this.delegate.isLocalPeersAllowed())) {
            return true;
        }
        if (this.hasChannelWithEndpoint(tcpEndpoint)) {
            return true;
        }
        this.channels.add(tcpChannel);
        // FIXME: parity code needed?
        return false;
    };
    TCPChannels.prototype.getChannelsAboveCutoff = function (cutoffTime) {
        throw 0; // FIXME
    };
    TCPChannels.prototype.stop = function () {
        throw 0; // FIXME
    };
    TCPChannels.prototype.purge = function (cutoffTime) {
        throw 0; // FIXME
    };
    TCPChannels.prototype.hasChannel = function (tcpEndpoint) {
        throw 0; // FIXME
    };
    return TCPChannels;
}());
exports.TCPChannels = TCPChannels;
var ChannelTCP = /** @class */ (function (_super) {
    __extends(ChannelTCP, _super);
    function ChannelTCP(socket, delegate) {
        var _this = _super.call(this, delegate) || this;
        _this.socket = socket;
        return _this;
    }
    ChannelTCP.prototype.sendBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw 0; // FIXME
            });
        });
    };
    ChannelTCP.prototype.getTCPEndpoint = function () {
        return this.tcpEndpoint;
    };
    ChannelTCP.prototype.setLastPacketReceived = function (moment) {
        this.lastPacketReceivedMoment = moment;
    };
    ChannelTCP.prototype.setLastPacketSent = function (moment) {
        this.lastPacketSentMoment = moment;
    };
    ChannelTCP.prototype.getNodeID = function () {
        return this.nodeID;
    };
    ChannelTCP.prototype.setNodeID = function (nodeID) {
        this.nodeID = nodeID;
    };
    ChannelTCP.prototype.setNetworkVersion = function (version) {
        this.networkVersion = version;
    };
    ChannelTCP.prototype.sendMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var messageBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Common_1.bufferFromSerializable(message)];
                    case 1:
                        messageBuffer = _a.sent();
                        return [2 /*return*/, this.socket.writeBuffer(messageBuffer)];
                }
            });
        });
    };
    ChannelTCP.prototype.connect = function (tcpEndpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socket.connect(tcpEndpoint)];
            });
        });
    };
    ChannelTCP.prototype.readMessageHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socket.readMessageHeader()];
            });
        });
    };
    ChannelTCP.prototype.asReadableMessageStream = function () {
        return this.socket.asReadableMessageStream();
    };
    return ChannelTCP;
}(Transport_1.default.Channel));
exports.ChannelTCP = ChannelTCP;
//# sourceMappingURL=TCP.js.map