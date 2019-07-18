"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../lib/Config");
var ipaddr = require("ipaddr.js");
var NANOWebSocket;
(function (NANOWebSocket) {
    var Config = /** @class */ (function () {
        function Config() {
            this.networkConstants = new Config_1.NetworkConstants();
            this.isEnabled = false;
            this.ipAddress = ipaddr.IPv6.parse('::1');
            this.port = this.networkConstants.defaultWebSocketPort;
        }
        Config.prototype.getIsEnabled = function () {
            return this.isEnabled;
        };
        Config.prototype.getPort = function () {
            return this.port;
        };
        Config.prototype.getIPAddress = function () {
            return this.ipAddress;
        };
        return Config;
    }());
    NANOWebSocket.Config = Config;
})(NANOWebSocket || (NANOWebSocket = {}));
exports.default = NANOWebSocket;
//# sourceMappingURL=WebSocketConfig.js.map