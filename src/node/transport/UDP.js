"use strict";
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
        return false; // FIXME
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
        return undefined; // FIXME
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
    // TODO
    UDPChannels.prototype.getChannelsAboveCutoff = function (cutoffTime) {
        return new Set();
    };
    UDPChannels.prototype.stop = function () {
    };
    UDPChannels.prototype.purge = function (cutoffTime) {
    };
    return UDPChannels;
}());
exports.UDPChannels = UDPChannels;
var ChannelUDP = /** @class */ (function () {
    function ChannelUDP() {
    }
    // FIXME: async?
    ChannelUDP.prototype.send = function (message) {
        // FIXME
    };
    return ChannelUDP;
}());
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