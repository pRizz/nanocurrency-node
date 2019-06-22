"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: audit
var Common_1 = require("../Common");
var Network_1 = require("../Network");
var Socket_1 = require("../Socket");
var tcpRealtimeProtocolVersionMin = Common_1.default.tcpRealtimeProtocolVersionMin;
var Transport_1 = require("./Transport");
var TCPChannels = /** @class */ (function () {
    function TCPChannels(port, messageReceivedCallback, delegate) {
        // this.udpSocket = dgram.createSocket('udp6')
        // this.udpSocket.bind(port)
        // this.udpSocket.on('error', (error) => {
        //     console.error(`${new Date().toISOString()}: udpSocket error: `, error)
        // })
        // this.udpSocket.on('message', (message, receiveInfo) => {
        //     if(this.isStopped) {
        //         return
        //     }
        //     const udpEndpoint = new UDPEndpoint() // FIXME
        //     messageReceivedCallback(new MessageBuffer(message, receiveInfo.size, udpEndpoint))
        // })
        this.delegate = delegate;
    }
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
            this.startTCPConnection(tcpEndpoint).catch(function (error) {
                console.error(new Date().toISOString() + ": an error occurred while starting a TCP connection, " + error);
            });
        }
    };
    // TODO:
    TCPChannels.prototype.cookieFromEndpoint = function (endpoint) {
        return new Network_1.SYNCookieInfo(); // FIXME
    };
    TCPChannels.prototype.startTCPConnection = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var socket, tcpChannel, tcpEndpoint, cookie, handshakeMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        socket = new Socket_1.Socket(Socket_1.SocketConcurrency.multiWriter);
                        tcpChannel = new ChannelTCP(socket);
                        tcpEndpoint = Transport_1.default.mapEndpointToTCP(endpoint);
                        return [4 /*yield*/, tcpChannel.connect(tcpEndpoint)]; // TODO: refactor; encapsulate socket
                    case 1:
                        _a.sent(); // TODO: refactor; encapsulate socket
                        cookie = this.delegate.getCookieForEndpoint(tcpEndpoint);
                        handshakeMessage = new Common_1.NodeIDHandshakeMessage(cookie);
                        return [4 /*yield*/, tcpChannel.sendMessage(handshakeMessage)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TCPChannels.prototype.startTCPReceiveNodeID = function (tcpChannel, endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    // TODO
    TCPChannels.prototype.getChannelsAboveCutoff = function (cutoffTime) {
        return new Set();
    };
    TCPChannels.prototype.stop = function () {
    };
    TCPChannels.prototype.purge = function (cutoffTime) {
    };
    // TODO
    TCPChannels.prototype.hasChannel = function (tcpEndpoint) {
        return false;
    };
    return TCPChannels;
}());
exports.TCPChannels = TCPChannels;
var ChannelTCP = /** @class */ (function () {
    function ChannelTCP(socket) {
        this.socket = socket;
    }
    ChannelTCP.prototype.sendBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socket.writeBuffer(buffer)];
            });
        });
    };
    ChannelTCP.prototype.sendMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendBuffer(message.asBuffer())];
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
    return ChannelTCP;
}());
exports.ChannelTCP = ChannelTCP;
//# sourceMappingURL=TCP.js.map