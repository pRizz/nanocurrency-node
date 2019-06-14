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
var Network_1 = require("../Network");
var dgram = require("dgram");
var Common_1 = require("../Common");
// TODO: audit
var UDPChannels = /** @class */ (function () {
    function UDPChannels(port, messageReceivedCallback, delegate) {
        var _this = this;
        this.isStopped = false;
        this.wrappedUDPChannels = new Set();
        this.udpSocket = dgram.createSocket('udp6');
        this.udpSocket.bind(port);
        this.udpSocket.on('error', function (error) {
            console.error(new Date().toISOString() + ": udpSocket error: ", error);
        });
        this.udpSocket.on('message', function (message, receiveInfo) {
            if (_this.isStopped) {
                return;
            }
            var udpEndpoint = new Common_1.UDPEndpoint(); // FIXME
            messageReceivedCallback(new Network_1.MessageBuffer(message, receiveInfo.size, udpEndpoint));
        });
        this.delegate = delegate;
    }
    UDPChannels.prototype.start = function () {
        this.startOngoingKeepalive();
    };
    UDPChannels.prototype.startOngoingKeepalive = function () {
        var e_1, _a;
        // get random
        var keepaliveMessage = new Common_1.KeepaliveMessage(this.delegate.getRandomPeers());
        var sendList = this.getChannelsAboveCutoff(10000); // FIXME
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
    };
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