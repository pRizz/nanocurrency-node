"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../Common");
var Transport;
(function (Transport) {
    function mapEndpointToTCP(endpoint) {
        return new Common_1.TCPEndpoint(endpoint.getAddress(), endpoint.getPort());
    }
    Transport.mapEndpointToTCP = mapEndpointToTCP;
    function isReserved(ipAddress, allowLocalPeers) {
        // TODO
        return true;
    }
    Transport.isReserved = isReserved;
    Transport.maxPeersPerIP = 10;
    var Channel = /** @class */ (function () {
        function Channel() {
        }
        return Channel;
    }());
    Transport.Channel = Channel;
})(Transport || (Transport = {}));
exports.default = Transport;
//# sourceMappingURL=Transport.js.map