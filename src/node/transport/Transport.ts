import {Endpoint, TCPEndpoint} from '../Common'

namespace Transport {
    export function mapEndpointToTCP(endpoint: Endpoint) {
        return new TCPEndpoint(endpoint.getAddress(), endpoint.getPort())
    }
}

export default Transport
