// TODO: audit
import Constants, {
    bufferFromSerializable,
    Endpoint,
    KeepaliveMessage,
    Message,
    MessageHeader,
    MessageType,
    NodeIDHandshakeMessage, NodeIDHandshakeMessageResponse, ReadableMessageStream,
    TCPEndpoint,
    UDPEndpoint
} from '../Common'
import {MessageBuffer, SYNCookie, SYNCookieInfo} from '../Network'
import {Socket, SocketConcurrency} from '../Socket'
import Transport from './Transport'
import Timeout = NodeJS.Timeout
import tcpRealtimeProtocolVersionMin = Constants.tcpRealtimeProtocolVersionMin
import Account from '../../lib/Account'
import UInt256 from '../../lib/UInt256'
import {Signature} from '../../lib/Numbers'
import UInt8 from '../../lib/UInt8'
import moment = require('moment')
import MessageSigner from '../../lib/MessageSigner'
import {Moment} from 'moment'
import UInt512 from '../../lib/UInt512'
import {PassThrough} from 'stream'

export class TCPChannels {
    private ongoingKeepaliveTimout?: Timeout
    private readonly delegate: TCPChannelsDelegate
    private readonly channels = new Set<ChannelTCP>()

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
            throw new Error(`Unexpected messageType received from remote node`)
        }
        if(messageHeader.versionUsing.lessThan(Constants.protocolVersionMin)) {
            throw new Error(`Invalid versionUsing received from remote node`)
        }

        const handshakeMessage = await NodeIDHandshakeMessage.from(messageHeader, tcpChannel.asReadableMessageStream())

        if(!handshakeMessage.response || !handshakeMessage.query) {
            throw new Error(`Missing response or query in TCP connection`)
        }

        tcpChannel.setNetworkVersion(messageHeader.versionUsing)
        const nodeID = handshakeMessage.response.account

        if(!this.delegate.isNodeValid(endpoint, nodeID, handshakeMessage.response.signature)
            || this.delegate.getNodeID().equals(nodeID)
            || this.delegate.hasNode(nodeID)
        ) {
            return
        }

        tcpChannel.setNodeID(nodeID)
        tcpChannel.setLastPacketReceived(moment())

        const signature = MessageSigner.sign(
            this.delegate.getPrivateKey(),
            handshakeMessage.query.asBuffer()
        )
        const response = new NodeIDHandshakeMessageResponse(this.delegate.getNodeID(), signature)
        const handshakeMessageResponse = NodeIDHandshakeMessage.fromResponse(response)

        await tcpChannel.sendMessage(handshakeMessageResponse)

        tcpChannel.setLastPacketReceived(moment())
        this.insertChannel(tcpChannel)
    }

    private hasChannelWithEndpoint(tcpEndpoint: TCPEndpoint | undefined): boolean {
        // TODO
        return false
    }

    private insertChannel(tcpChannel: ChannelTCP): boolean {
        if(!this.delegate.hasPeer(tcpChannel.getTCPEndpoint(), this.delegate.isLocalPeersAllowed())) {
            return true
        }

        if(this.hasChannelWithEndpoint(tcpChannel.getTCPEndpoint())) {
            return true
        }

        this.channels.add(tcpChannel)
        // FIXME: parity code needed?
        return false
    }

    // TODO
    private getChannelsAboveCutoff(cutoffTime: number): Set<ChannelTCP> {
        return new Set()
    }

    // TODO
    stop() {

    }

    // TODO
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
    isNodeValid(endpoint: TCPEndpoint, nodeID: Account, signature: Signature): boolean
    getNodeID(): Account
    hasNode(nodeID: Account): boolean
    getPrivateKey(): UInt512
    isLocalPeersAllowed(): boolean
    hasPeer(endpoint: UDPEndpoint | undefined, allowLocalPeers: boolean): boolean
}

export class ChannelTCP {
    private readonly socket: Socket
    private networkVersion?: UInt8
    private nodeID?: Account
    private lastPacketReceivedMoment?: Moment
    private tcpEndpoint?: TCPEndpoint

    constructor(socket: Socket) {
        this.socket = socket
    }

    getTCPEndpoint(): TCPEndpoint | undefined {
        return this.tcpEndpoint
    }

    setLastPacketReceived(moment: Moment) {
        this.lastPacketReceivedMoment = moment
    }

    setNodeID(nodeID: Account) {
        this.nodeID = nodeID
    }

    setNetworkVersion(version: UInt8) {
        this.networkVersion = version
    }

    async sendMessage(message: Message): Promise<void> {
        const messageBuffer = await bufferFromSerializable(message)
        return this.socket.writeBuffer(messageBuffer)
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
