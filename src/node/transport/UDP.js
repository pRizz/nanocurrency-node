"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var dgram = require("dgram");
var Common_1 = require("../Common");
var ipaddr_js_1 = require("ipaddr.js");
var Transport_1 = require("./Transport");
var EndpointConnectionAttempt = /** @class */ (function () {
    function EndpointConnectionAttempt(endpoint, moment) {
        this.endpoint = endpoint;
        this.moment = moment;
    }
    return EndpointConnectionAttempt;
}());
exports.EndpointConnectionAttempt = EndpointConnectionAttempt;
var EndpointConnectionAttempts = /** @class */ (function () {
    function EndpointConnectionAttempts() {
    }
    EndpointConnectionAttempts.prototype.has = function (endpoint) {
        throw 0; // FIXME
    };
    return EndpointConnectionAttempts;
}());
exports.EndpointConnectionAttempts = EndpointConnectionAttempts;
// TODO: audit
var UDPChannels = /** @class */ (function () {
    function UDPChannels(port, delegate) {
        var _this = this;
        this.isStopped = false;
        this.wrappedUDPChannels = new Set();
        this.attempts = new EndpointConnectionAttempts();
        this.udpSocket = dgram.createSocket('udp6');
        this.udpSocket.bind(port);
        this.udpSocket.on('error', function (error) {
            console.error(new Date().toISOString() + ": udpSocket error: ", error);
        });
        this.udpSocket.on('message', function (message, receiveInfo) {
            if (_this.isStopped) {
                return;
            }
        });
        this.localEndpoint = new Common_1.UDPEndpoint(new Common_1.IPAddress(ipaddr_js_1.IPv6.parse('::1')), port);
        this.delegate = delegate;
    }
    UDPChannels.prototype.getChannelCount = function () {
        return 0; // FIXME
    };
    UDPChannels.prototype.hasReachoutError = function (endpoint) {
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
    UDPChannels.prototype.getChannelFor = function (endpoint) {
        throw 0; // FIXME
    };
    UDPChannels.prototype.isEndpointOverloaded = function (endpoint) {
        return this.connectionCountFor(endpoint) >= Transport_1.default.maxPeersPerIP;
    };
    UDPChannels.prototype.connectionCountFor = function (endpoint) {
        return 0; // FIXME
    };
    UDPChannels.prototype.getLocalEndpoint = function () {
        return this.localEndpoint;
    };
    UDPChannels.prototype.start = function () {
        this.startOngoingKeepalive();
    };
    UDPChannels.prototype.startOngoingKeepalive = function () {
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
                    channel.send(keepaliveMessage);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sendList_1_1 && !sendList_1_1.done && (_a = sendList_1.return)) _a.call(sendList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, 100000); // FIXME
    };
    UDPChannels.prototype.getChannelsAboveCutoff = function (cutoffTime) {
        throw 0; // FIXME
    };
    UDPChannels.prototype.stop = function () {
        throw 0; // FIXME
    };
    UDPChannels.prototype.purge = function (cutoffTime) {
        throw 0; // FIXME
    };
    return UDPChannels;
}());
exports.UDPChannels = UDPChannels;
var ChannelUDP = /** @class */ (function (_super) {
    __extends(ChannelUDP, _super);
    function ChannelUDP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // FIXME: async?
    ChannelUDP.prototype.sendBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw 0; // FIXME
            });
        });
    };
    return ChannelUDP;
}(Transport_1.default.Channel));
exports.ChannelUDP = ChannelUDP;
var ChannelUDPWrapper = /** @class */ (function () {
    function ChannelUDPWrapper() {
    }
    ChannelUDPWrapper.prototype.send = function (message) {
        this.channelUDP.send(message);
    };
    return ChannelUDPWrapper;
}());
exports.ChannelUDPWrapper = ChannelUDPWrapper;
//# sourceMappingURL=UDP.js.map