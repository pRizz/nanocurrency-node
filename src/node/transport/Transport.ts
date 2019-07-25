import {Endpoint, IPAddress, Message, TCPEndpoint} from '../Common'

namespace Transport {
    export function mapEndpointToTCP(endpoint: Endpoint) {
        return new TCPEndpoint(endpoint.getAddress(), endpoint.getPort())
    }

    export function isReserved(ipAddress: IPAddress, allowLocalPeers: boolean): boolean {
        throw 0 // FIXME
    }

    export const maxPeersPerIP = 10

    export interface TransportChannelDelegate {

    }

    export abstract class Channel {
        constructor(protected readonly delegate: TransportChannelDelegate) {}

        async send(message: Message): Promise<void> {
            const messageBuffer = message.asBuffer()
            return this.sendBuffer(messageBuffer)
        }

        abstract sendBuffer(buffer: Buffer): Promise<void>
    }
}

export default Transport
