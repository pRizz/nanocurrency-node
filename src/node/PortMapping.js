"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortMapping = exports.MappingProtocol = void 0;
var Common_1 = require("./Common");
var ipaddr = require("ipaddr.js");
var MappingProtocol = /** @class */ (function () {
    function MappingProtocol(protocolName, remaining, externalAddress, externalPort) {
        this.protocolName = protocolName;
        this.remaining = remaining;
        this.externalAddress = externalAddress;
        this.externalPort = externalPort;
    }
    return MappingProtocol;
}());
exports.MappingProtocol = MappingProtocol;
var PortMapping = /** @class */ (function () {
    function PortMapping(portMappingDelegate) {
        this.portMappingDelegate = portMappingDelegate;
        this.isOn = false;
        this.protocols = [
            new MappingProtocol('TCP', 0, ipaddr.IPv4.parse('0.0.0.0'), 0),
            new MappingProtocol('UDP', 0, ipaddr.IPv4.parse('0.0.0.0'), 0),
        ];
    }
    PortMapping.prototype.start = function () {
        throw 0; // FIXME
    };
    PortMapping.prototype.stop = function () {
        throw 0; // FIXME
    };
    PortMapping.prototype.refreshDevices = function () {
        throw 0; // FIXME
    };
    PortMapping.prototype.getExternalAddress = function () {
        throw 0; // FIXME
        return new Common_1.UDPEndpoint(new Common_1.IPAddress(ipaddr.IPv6.parse('::')), 0);
    };
    return PortMapping;
}());
exports.PortMapping = PortMapping;
//# sourceMappingURL=PortMapping.js.map