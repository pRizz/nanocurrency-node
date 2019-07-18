import {Endpoint, IPAddress, UDPEndpoint} from './Common'
import ipaddr = require('ipaddr.js');

export class MappingProtocol {
    constructor(
        readonly protocolName: 'TCP' | 'UDP',
        readonly remaining: number,
        readonly externalAddress: ipaddr.IPv4,
        readonly externalPort: number
    ) {}
}

export interface PortMappingDelegate {

}

export class PortMapping {
    readonly protocols: Array<MappingProtocol>
    private readonly isOn = false

    constructor(readonly portMappingDelegate: PortMappingDelegate) {
        this.protocols = [
            new MappingProtocol('TCP', 0, ipaddr.IPv4.parse('0.0.0.0'), 0),
            new MappingProtocol('UDP', 0, ipaddr.IPv4.parse('0.0.0.0'), 0),
        ]
    }

    start() {
        // TODO
    }

    stop() {
        // TODO
    }

    refreshDevices() {
        // TODO
    }

    getExternalAddress(): Endpoint {
        // TODO
        return new UDPEndpoint(new IPAddress(ipaddr.IPv6.parse('::')), 0)
    }

}
