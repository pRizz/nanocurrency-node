import {MessageBuffer} from '../Network'
import {Socket} from 'dgram'
import * as dgram from 'dgram'
import {KeepaliveMessage, Message, UDPEndpoint} from '../Common'

// TODO: audit
export class UDPChannels {
    private readonly udpSocket: Socket
    private isStopped = false
    private readonly delegate: UDPChannelsDelegate
    private readonly wrappedUDPChannels = new Set<ChannelUDPWrapper>()

    constructor(port: number, messageReceivedCallback: (message: MessageBuffer) => void, delegate: UDPChannelsDelegate) {
        this.udpSocket = dgram.createSocket('udp6')
        this.udpSocket.bind(port)
        this.udpSocket.on('error', (error) => {
            console.error(`${new Date().toISOString()}: udpSocket error: `, error)
        })
        this.udpSocket.on('message', (message, receiveInfo) => {
            if(this.isStopped) {
                return
            }
            const udpEndpoint = new UDPEndpoint() // FIXME
            messageReceivedCallback(new MessageBuffer(message, receiveInfo.size, udpEndpoint))
        })
        this.delegate = delegate
    }

    start() {
        this.startOngoingKeepalive()
    }

    private startOngoingKeepalive() {
        // get random
        const keepaliveMessage = new KeepaliveMessage(this.delegate.getRandomPeers())
        const sendList = this.getChannelsAboveCutoff(10000) // FIXME
        for(const channel of sendList) {
            channel.send(keepaliveMessage)
        }
    }

    private getChannelsAboveCutoff(cutoffTime: number): Set<ChannelUDPWrapper> {
        return new Set()
    }

    stop() {

    }

    purge(cutoffTime: number) {

    }
}

export interface UDPChannelsDelegate {
    getRandomPeers(): Set<UDPEndpoint>
}

export class ChannelUDP {
    send(message: Message) {
        // FIXME
    }
}

export class ChannelUDPWrapper {
    private readonly channelUDP: ChannelUDP

    send(message: Message) {
        this.channelUDP.send(message)
    }
}
