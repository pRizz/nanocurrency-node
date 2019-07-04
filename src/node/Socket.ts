import { Socket as NetSocket } from 'net'
import {Endpoint, MessageHeader, ReadableMessageStream, TCPEndpoint} from './Common'
import {promisify} from 'util'
import {Duplex} from 'stream'

export enum SocketConcurrency {
    singleWriter,
    multiWriter
}

export interface Serializable {
    serialize(stream: NodeJS.WritableStream): void // TODO: consider returning a Promise for asynchonous serialization
}

export class Socket {
    readonly concurrency: SocketConcurrency
    private readonly tcpSocket: NetSocket
    private remoteEndpoint: Endpoint
    private isClosed = false

    constructor(concurrency: SocketConcurrency) {
        this.concurrency = concurrency
        this.tcpSocket = new NetSocket().setKeepAlive(true).pause()
    }

    serialize(serializable: Serializable) {
        serializable.serialize(this.tcpSocket)
    }

    asReadableMessageStream(): ReadableMessageStream {
        return new ReadableMessageStream(this.tcpSocket)
    }

    async connect(tcpEndpoint: TCPEndpoint): Promise<void> {
        return new Promise((resolve) => {
            this.checkup()
            this.tcpSocket.connect({
                port: tcpEndpoint.port,
                host: tcpEndpoint.address.toString()
            }, () => {
                this.remoteEndpoint = tcpEndpoint
                resolve()
            })
        })
    }

    // TODO
    private checkup() {

    }

    async writeBuffer(buffer: Buffer): Promise<void> {
        if(this.isClosed) {
            return Promise.reject(new Error('Socket is closed'))
        }
        switch (this.concurrency) {
            case SocketConcurrency.multiWriter:
                return this.writeBufferMultiWriter(buffer)
            case SocketConcurrency.singleWriter:
                return this.writeBufferSingleWriter(buffer)
        }
    }

    // FIXME
    private async writeBufferMultiWriter(buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tcpSocket.write(buffer, (error) => {
                if(error) { return reject(error) }
                resolve()
            })
        })
    }

    // FIXME
    private async writeBufferSingleWriter(buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tcpSocket.write(buffer, (error) => {
                if(error) { return reject(error) }
                resolve()
            })
        })
    }

    // FIXME: doesn't belong in this class
    async readMessageHeader(): Promise<MessageHeader> {
        return MessageHeader.from(this.tcpSocket, 30000)
    }
}
