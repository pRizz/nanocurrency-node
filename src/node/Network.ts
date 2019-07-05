import {Endpoint, IPAddress, Message, TCPEndpoint, UDPEndpoint} from './Common'
import {Stat} from '../lib/Stats'
import Timeout = NodeJS.Timeout
import {UDPChannels, UDPChannelsDelegate} from './transport/UDP'
import {TCPChannels, TCPChannelsDelegate} from './transport/TCP'
import UInt256 from '../lib/UInt256'
import Transport from './transport/Transport'
import {IPv6} from 'ipaddr.js'

// TODO: audit
export class MessageBuffer {
    buffer: Buffer
    size: number // TODO: audit; use int
    udpEndpoint: UDPEndpoint

    constructor(buffer: Buffer, size: number, udpEndpoint: UDPEndpoint) {
        this.buffer = buffer
        this.size = size
        this.udpEndpoint = udpEndpoint
    }
}

// TODO: audit
export class MessageBufferManager {
    constructor(stat: Stat, bufferSize: number, bufferCount: number) {

    }

    enqueue(messageBuffer: MessageBuffer) {

    }

    async dequeue(): Promise<MessageBuffer> {
        return new Promise((resolve, reject) => {
            // FIXME
        })
    }
}

// TODO: audit
export class ResponseChannels {
    add(tcpEndpoint: TCPEndpoint, tcpEndpoints: Array<TCPEndpoint>) {

    }

    search(tcpEndpoint: TCPEndpoint): Array<TCPEndpoint> {
        return []
    }

    remove(tcpEndpoint: TCPEndpoint) {

    }

    getSize(): number {
        return 0
    }
}

// TODO: audit
export class SYNCookies {
    purge(timePoint: number) {

    }
}

export class SYNCookie {
    readonly value: UInt256
}

export class SYNCookieInfo {
    readonly cookie: SYNCookie
    readonly creationTime: number // FIXME
}

export interface NetworkDelegate {
}

// TODO: audit
export class Network {
    private cleanupInterval: Timeout | null
    private synCookieCleanupInterval: Timeout | null
    private keepaliveInterval: Timeout | null
    readonly udpChannels: UDPChannels
    readonly tcpChannels: TCPChannels
    private synCookies: SYNCookies
    private readonly disableUDP: boolean

    constructor(disableUDP: boolean, port: number, udpChannelsDelegate: UDPChannelsDelegate, tcpChannelsDelegate: TCPChannelsDelegate) {
        this.disableUDP = disableUDP
        this.udpChannels = new UDPChannels(port, udpChannelsDelegate)
        this.tcpChannels = new TCPChannels(tcpChannelsDelegate)
    }

    sendKeepalive(channel: Transport.Channel) {
        // TODO
    }

    start() {
        this.startCleanupInterval()
        this.startSynCookieCleanupInterval()
        if(!this.disableUDP) {
            this.udpChannels.start()
        }
        this.tcpChannels.start()
        this.startOngoingKeepaliveInterval()
    }

    private isNotAPeer(endpoint: Endpoint, allowLocalPeers: boolean): boolean {
        if(endpoint.getAddress().isUnspecified()) {
            return true
        }
        if(endpoint.getAddress().isReserved()) {
            return true
        }
        if(Transport.isReserved(endpoint.getAddress(), allowLocalPeers)) {
            return true
        }
        if(endpoint.equals(this.getLocalUDPEndpoint())) {
            return true
        }

        return false
    }

    private getLocalUDPEndpoint(): UDPEndpoint {
        return this.udpChannels.getLocalEndpoint()
    }

    hasReachoutError(endpoint: Endpoint, allowLocalPeers: boolean): boolean {
        if(this.isNotAPeer(endpoint, allowLocalPeers)) {
            return true
        }

        let error = false

        error = error || this.udpChannels.hasReachoutError(endpoint)
        error = error || this.tcpChannels.hasReachoutError(endpoint)

        return error
    }

    private startOngoingKeepaliveInterval() {
        if(this.keepaliveInterval) {
            return
        }
        this.keepaliveInterval = setInterval(() => {
            this.floodKeepalive()
        }, 100000) // FIXME
    }

    private cleanup(cutoffTime: number) {
        this.tcpChannels.purge(cutoffTime)
        this.udpChannels.purge(cutoffTime)
    }

    private startCleanupInterval() {
        if(this.cleanupInterval) {
            return
        }
        this.cleanupInterval = setInterval(() => {
            this.cleanup(100000) // FIXME
        }, 1000000) // FIXME
    }

    private synCookieCleanup(cutoffTime: number) {
        this.synCookies.purge(cutoffTime)
    }

    private startSynCookieCleanupInterval() {
        if(this.synCookieCleanupInterval) {
            return
        }
        this.synCookieCleanupInterval = setInterval(() => {
            this.synCookieCleanup(100000) // FIXME
        }, 100000) // FIXME
    }

    stop() {

    }

    floodMessage(message: Message) {

    }

    floodKeepalive() {

    }

    floodVote() {

    }

    floodBlock() {

    }

    floodBlockBatch() {

    }
}


