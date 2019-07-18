"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // TODO
    };
    PortMapping.prototype.stop = function () {
        // TODO
    };
    PortMapping.prototype.refreshDevices = function () {
        // TODO
    };
    PortMapping.prototype.getExternalAddress = function () {
        // TODO
        return new Common_1.UDPEndpoint(new Common_1.IPAddress(ipaddr.IPv6.parse('::')), 0);
    };
    return PortMapping;
}());
exports.PortMapping = PortMapping;
//# sourceMappingURL=PortMapping.js.map