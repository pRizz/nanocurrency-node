import {Endpoint, IPAddress, TCPEndpoint} from '../Common'

namespace Transport {
    export function mapEndpointToTCP(endpoint: Endpoint) {
        return new TCPEndpoint(endpoint.getAddress(), endpoint.getPort())
    }

    export function isReserved(ipAddress: IPAddress, allowLocalPeers: boolean): boolean {
        // TODO
        return true
    }

    export const maxPeersPerIP = 10

    export abstract class Channel {

    }
}

export default Transport
