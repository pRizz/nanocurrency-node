import {MessageBuffer} from '../Network'
import {Socket} from 'dgram'
import * as dgram from 'dgram'
import {Endpoint, IPAddress, KeepaliveMessage, Message, UDPEndpoint} from '../Common'
import Timeout = NodeJS.Timeout
import {IPv6} from "ipaddr.js"
import Transport from './Transport'
import {Moment} from 'moment'

export class EndpointConnectionAttempt {
    readonly endpoint: Endpoint
    readonly moment: Moment

    constructor(endpoint: Endpoint, moment: Moment) {
        this.endpoint = endpoint
        this.moment = moment
    }
}

export class EndpointConnectionAttempts {
    has(endpoint: Endpoint): boolean {
        return false // FIXME
    }
}

// TODO: audit
export class UDPChannels {
    private readonly udpSocket: Socket
    private isStopped = false
    private readonly delegate: UDPChannelsDelegate
    private readonly wrappedUDPChannels = new Set<ChannelUDPWrapper>()
    private ongoingKeepaliveTimout: Timeout | null
    private localEndpoint: UDPEndpoint
    private readonly attempts = new EndpointConnectionAttempts()

    constructor(port: number, delegate: UDPChannelsDelegate) {
        this.udpSocket = dgram.createSocket('udp6')
        this.udpSocket.bind(port)
        this.udpSocket.on('error', (error) => {
            console.error(`${new Date().toISOString()}: udpSocket error: `, error)
        })
        this.udpSocket.on('message', (message, receiveInfo) => {
            if(this.isStopped) {
                return
            }
        })
        this.localEndpoint = new UDPEndpoint(new IPAddress(IPv6.parse('::1')), port)
        this.delegate = delegate
    }

    getChannelCount(): number {
        return 0 // FIXME
    }

    hasReachoutError(endpoint: Endpoint): boolean {
        if(this.isEndpointOverloaded(endpoint)) {
            return true
        }
        if(this.getChannelFor(endpoint) !== undefined) {
            return true
        }
        if(this.attempts.has(endpoint)) {
            return true
        }
        // TODO: figure out if attempts.insert is needed here
        return false
    }

    private getChannelFor(endpoint: Endpoint): ChannelUDP | undefined {
        return undefined // FIXME
    }

    private isEndpointOverloaded(endpoint: Endpoint): boolean {
        return this.connectionCountFor(endpoint) >= Transport.maxPeersPerIP
    }

    private connectionCountFor(endpoint: Endpoint): number {
        return 0 // FIXME
    }

    getLocalEndpoint(): UDPEndpoint {
        return this.localEndpoint
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
                channel.send(keepaliveMessage)
            }
        }, 100000) // FIXME
    }

    // TODO
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
    // FIXME: async?
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
