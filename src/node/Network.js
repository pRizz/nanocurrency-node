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
Object.defineProperty(exports, "__esModule", { value: true });
var UDP_1 = require("./transport/UDP");
var TCP_1 = require("./transport/TCP");
var Transport_1 = require("./transport/Transport");
// TODO: audit
var MessageBuffer = /** @class */ (function () {
    function MessageBuffer(buffer, size, udpEndpoint) {
        this.buffer = buffer;
        this.size = size;
        this.udpEndpoint = udpEndpoint;
    }
    return MessageBuffer;
}());
exports.MessageBuffer = MessageBuffer;
// TODO: audit
var MessageBufferManager = /** @class */ (function () {
    function MessageBufferManager(stat, bufferSize, bufferCount) {
    }
    MessageBufferManager.prototype.enqueue = function (messageBuffer) {
    };
    MessageBufferManager.prototype.dequeue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        throw 0; // FIXME
                    })];
            });
        });
    };
    return MessageBufferManager;
}());
exports.MessageBufferManager = MessageBufferManager;
// TODO: audit
var ResponseChannels = /** @class */ (function () {
    function ResponseChannels() {
    }
    ResponseChannels.prototype.add = function (tcpEndpoint, tcpEndpoints) {
    };
    ResponseChannels.prototype.search = function (tcpEndpoint) {
        return [];
    };
    ResponseChannels.prototype.remove = function (tcpEndpoint) {
    };
    ResponseChannels.prototype.getSize = function () {
        return 0;
    };
    return ResponseChannels;
}());
exports.ResponseChannels = ResponseChannels;
// TODO: audit
var SYNCookies = /** @class */ (function () {
    function SYNCookies() {
    }
    SYNCookies.prototype.purge = function (timePoint) {
    };
    return SYNCookies;
}());
exports.SYNCookies = SYNCookies;
var SYNCookie = /** @class */ (function () {
    function SYNCookie(value) {
        this.value = value;
    }
    return SYNCookie;
}());
exports.SYNCookie = SYNCookie;
var SYNCookieInfo = /** @class */ (function () {
    function SYNCookieInfo(cookie, creationMoment) {
        this.cookie = cookie;
        this.creationMoment = creationMoment;
    }
    return SYNCookieInfo;
}());
exports.SYNCookieInfo = SYNCookieInfo;
// TODO: audit
var Network = /** @class */ (function () {
    function Network(disableUDP, port, udpChannelsDelegate, tcpChannelsDelegate) {
        this.disableUDP = disableUDP;
        this.udpChannels = new UDP_1.UDPChannels(port, udpChannelsDelegate);
        this.tcpChannels = new TCP_1.TCPChannels(tcpChannelsDelegate);
    }
    Network.prototype.sendKeepalive = function (channel) {
        throw 0; // FIXME
    };
    Network.prototype.start = function () {
        this.startCleanupInterval();
        this.startSynCookieCleanupInterval();
        if (!this.disableUDP) {
            this.udpChannels.start();
        }
        this.tcpChannels.start();
        this.startOngoingKeepaliveInterval();
    };
    Network.prototype.isNotAPeer = function (endpoint, allowLocalPeers) {
        if (endpoint.getAddress().isUnspecified()) {
            return true;
        }
        if (endpoint.getAddress().isReserved()) {
            return true;
        }
        if (Transport_1.default.isReserved(endpoint.getAddress(), allowLocalPeers)) {
            return true;
        }
        if (endpoint.equals(this.getLocalUDPEndpoint())) {
            return true;
        }
        return false;
    };
    Network.prototype.getLocalUDPEndpoint = function () {
        return this.udpChannels.getLocalEndpoint();
    };
    Network.prototype.hasReachoutError = function (endpoint, allowLocalPeers) {
        if (this.isNotAPeer(endpoint, allowLocalPeers)) {
            return true;
        }
        var error = false;
        error = error || this.udpChannels.hasReachoutError(endpoint);
        error = error || this.tcpChannels.hasReachoutError(endpoint);
        return error;
    };
    Network.prototype.startOngoingKeepaliveInterval = function () {
        var _this = this;
        if (this.keepaliveInterval) {
            return;
        }
        this.keepaliveInterval = setInterval(function () {
            _this.floodKeepalive();
        }, 100000); // FIXME
    };
    Network.prototype.cleanup = function (cutoffTime) {
        this.tcpChannels.purge(cutoffTime);
        this.udpChannels.purge(cutoffTime);
    };
    Network.prototype.startCleanupInterval = function () {
        var _this = this;
        if (this.cleanupInterval) {
            return;
        }
        this.cleanupInterval = setInterval(function () {
            _this.cleanup(100000); // FIXME
        }, 1000000); // FIXME
    };
    Network.prototype.synCookieCleanup = function (cutoffTime) {
        this.synCookies.purge(cutoffTime);
    };
    Network.prototype.startSynCookieCleanupInterval = function () {
        var _this = this;
        if (this.synCookieCleanupInterval) {
            return;
        }
        this.synCookieCleanupInterval = setInterval(function () {
            _this.synCookieCleanup(100000); // FIXME
        }, 100000); // FIXME
    };
    Network.prototype.stop = function () {
    };
    Network.prototype.floodMessage = function (message) {
    };
    Network.prototype.floodKeepalive = function () {
    };
    Network.prototype.floodVote = function () {
    };
    Network.prototype.floodBlock = function () {
    };
    Network.prototype.floodBlockBatch = function () {
    };
    return Network;
}());
exports.Network = Network;
//# sourceMappingURL=Network.js.map