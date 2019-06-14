import {Message, TCPEndpoint, UDPEndpoint} from './Common'
import {Stat} from '../lib/Stats'
import Timeout = NodeJS.Timeout
import {UDPChannels} from './transport/UDP'
import {TCPChannels} from './transport/TCP'

// TODO: audit
export class MessageBuffer {
    buffer: Buffer
    size: number // TODO: audit; use int
    udpEndpoint: UDPEndpoint
}

// TODO: audit
export class MessageBufferManager {
    constructor(stat: Stat, bufferSize: number, bufferCount: number) {

    }

    enqueue(messageBuffer: MessageBuffer) {

    }

    async dequeue(): Promise<MessageBuffer> {
        return new Promise((resolve, reject) => {
            return new MessageBuffer()
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

// TODO: audit
export class Network {
    private cleanupInterval: Timeout | null
    private synCookieCleanupInterval: Timeout | null
    private keepaliveInterval: Timeout | null
    private udpChannels: UDPChannels
    private tcpChannels: TCPChannels
    private synCookies: SYNCookies
    private readonly disableUDP: boolean

    constructor(props: any) {
        this.disableUDP = props.disableUDP || false
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


