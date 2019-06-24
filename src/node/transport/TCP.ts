// TODO: audit
import Constants, {
    Endpoint,
    KeepaliveMessage,
    Message,
    MessageHeader,
    MessageType,
    NodeIDHandshakeMessage, ReadableMessageStream,
    TCPEndpoint,
    UDPEndpoint
} from '../Common'
import {MessageBuffer, SYNCookie, SYNCookieInfo} from '../Network'
import {Socket, SocketConcurrency} from '../Socket'
import Transport from './Transport'
import Timeout = NodeJS.Timeout
import tcpRealtimeProtocolVersionMin = Constants.tcpRealtimeProtocolVersionMin
import Account from '../../lib/Account'

export class TCPChannels {
    private ongoingKeepaliveTimout?: Timeout
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
        const accountCookie = this.delegate.getAccountCookieForEndpoint(tcpEndpoint)
        const handshakeMessage = NodeIDHandshakeMessage.fromQuery(accountCookie.publicKey)
        await tcpChannel.sendMessage(handshakeMessage)
        await this.startTCPReceiveNodeID(tcpChannel, tcpEndpoint)
    }

    private async startTCPReceiveNodeID(tcpChannel: ChannelTCP, endpoint: TCPEndpoint): Promise<void> {
        const messageHeader = await tcpChannel.readMessageHeader()
        if(messageHeader.messageType !== MessageType.node_id_handshake) {
            return Promise.reject(new Error(`Unexpected messageType received from remote node`))
        }
        if(messageHeader.versionUsing.lessThan(Constants.protocolVersionMin)) {
            return Promise.reject(new Error(`Invalid versionUsing received from remote node`))
        }

        const handshakeMessage = await NodeIDHandshakeMessage.from(messageHeader, tcpChannel.asReadableMessageStream())

        // TODO
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
    getAccountCookieForEndpoint(endpoint: Endpoint): Account
}

export class ChannelTCP {
    private readonly socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    sendMessage(message: Message): void {
        this.socket.serialize(message)
    }

    async connect(tcpEndpoint: TCPEndpoint): Promise<void> {
        return this.socket.connect(tcpEndpoint)
    }

    async readMessageHeader(): Promise<MessageHeader> {
        return this.socket.readMessageHeader()
    }

    asReadableMessageStream(): ReadableMessageStream {
        return this.socket.asReadableMessageStream()
    }
}
