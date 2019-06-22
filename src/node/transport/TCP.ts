// TODO: audit
import Constants, {
    Endpoint,
    KeepaliveMessage,
    Message,
    NodeIDHandshakeMessage,
    TCPEndpoint,
    UDPEndpoint
} from '../Common'
import {MessageBuffer, SYNCookie, SYNCookieInfo} from '../Network'
import {Socket, SocketConcurrency} from '../Socket'
import Timeout = NodeJS.Timeout
import tcpRealtimeProtocolVersionMin = Constants.tcpRealtimeProtocolVersionMin
import Transport from './Transport'

export class TCPChannels {
    private ongoingKeepaliveTimout: Timeout | null
    private readonly delegate: TCPChannelsDelegate

    constructor(port: number, messageReceivedCallback: (message: MessageBuffer) => void, delegate: TCPChannelsDelegate) {
        // this.udpSocket = dgram.createSocket('udp6')
        // this.udpSocket.bind(port)
        // this.udpSocket.on('error', (error) => {
        //     console.error(`${new Date().toISOString()}: udpSocket error: `, error)
        // })
        // this.udpSocket.on('message', (message, receiveInfo) => {
        //     if(this.isStopped) {
        //         return
        //     }
        //     const udpEndpoint = new UDPEndpoint() // FIXME
        //     messageReceivedCallback(new MessageBuffer(message, receiveInfo.size, udpEndpoint))
        // })
        this.delegate = delegate
    }

    start() {
        this.startOngoingKeepalive()
    }

    private startOngoingKeepalive() {
        if(this.ongoingKeepaliveTimout) {
            return
        }
        this.ongoingKeepaliveTimout = setInterval(() => {
            const keepaliveMessage = new KeepaliveMessage(this.delegate.getRandomPeers())
            const sendList = this.getChannelsAboveCutoff(10000) // FIXME
            for(const channel of sendList) {
                channel.sendMessage(keepaliveMessage).catch((error) => {
                    console.error(`${new Date().toISOString()}: an error occurred while sending keepalive message, ${error}`)
                })
            }
            this.connectToKnownUDPPeers()
        }, 100000) // FIXME
    }

    // TODO
    private connectToKnownUDPPeers() {
        const randomCount = Math.min(6, Math.ceil(Math.sqrt(this.delegate.getUDPChannelCount())))
        for(let i = 0; i < randomCount; ++i) {
            const tcpEndpoint = this.delegate.bootstrapPeer(tcpRealtimeProtocolVersionMin)
            if(this.hasChannel(tcpEndpoint)) {
                continue
            }
            this.startTCPConnection(tcpEndpoint).catch((error) => {
                console.error(`${new Date().toISOString()}: an error occurred while starting a TCP connection, ${error}`)
            })
        }
    }

    // TODO:
    private cookieFromEndpoint(endpoint: Endpoint): SYNCookieInfo {
        return new SYNCookieInfo() // FIXME
    }

    private async startTCPConnection(endpoint: Endpoint): Promise<void> {
        const socket = new Socket(SocketConcurrency.multiWriter)
        const tcpChannel = new ChannelTCP(socket)
        const tcpEndpoint = Transport.mapEndpointToTCP(endpoint)
        await tcpChannel.connect(tcpEndpoint) // TODO: refactor; encapsulate socket
        const cookie = this.delegate.getCookieForEndpoint(tcpEndpoint)
        const handshakeMessage = new NodeIDHandshakeMessage(cookie)
        await tcpChannel.sendMessage(handshakeMessage)

    }

    private async startTCPReceiveNodeID(tcpChannel: ChannelTCP, endpoint: TCPEndpoint): Promise<void> {

    }

    // TODO
    private getChannelsAboveCutoff(cutoffTime: number): Set<ChannelTCP> {
        return new Set()
    }

    stop() {

    }

    purge(cutoffTime: number) {

    }

    // TODO
    private hasChannel(tcpEndpoint: TCPEndpoint): boolean {
        return false
    }
}

export interface TCPChannelsDelegate {
    getRandomPeers(): Set<UDPEndpoint>
    getUDPChannelCount(): number
    bootstrapPeer(protocolVersionMin: number): TCPEndpoint
    startTCPReceiveNodeID(channel: ChannelTCP, endpoint: Endpoint, receiveBuffer: Buffer, callback: () => void): void
    tcpSocketConnectionFailed(): void
    getCookieForEndpoint(endpoint: Endpoint): SYNCookie
}

export class ChannelTCP {
    private readonly socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    private async sendBuffer(buffer: Buffer): Promise<void> {
        return this.socket.writeBuffer(buffer)
    }

    async sendMessage(message: Message): Promise<void> {
        return this.sendBuffer(message.asBuffer())
    }

    async connect(tcpEndpoint: TCPEndpoint): Promise<void> {
        return this.socket.connect(tcpEndpoint)
    }

    // consumeBuffer(): Buffer {
    //     return this.socket.consumeBuffer()
    // }
}
