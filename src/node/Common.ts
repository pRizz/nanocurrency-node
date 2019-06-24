import {SYNCookie} from './Network'
import {NetworkParams} from '../secure/Common'
import {Readable, Writable} from 'stream'
import UInt8 from '../lib/UInt8'
import UInt16 from '../lib/UInt16'

export class IPAddress {
    value: string

    constructor(ipValue: string) {
        this.value = ipValue
    }
}

export interface Endpoint {
    getAddress(): IPAddress
    getPort(): number
}

export class UDPEndpoint implements Endpoint {
    readonly address: IPAddress
    readonly port: number
    constructor(address: IPAddress, port: number) {
        this.address = address
        this.port = port
    }

    getAddress(): IPAddress {
        return this.address
    }

    getPort(): number {
        return this.port
    }
}

export class TCPEndpoint implements Endpoint {
    readonly address: IPAddress
    readonly port: number
    constructor(address: IPAddress, port: number) {
        this.address = address
        this.port = port
    }

    getAddress(): IPAddress {
        return this.address
    }

    getPort(): number {
        return this.port
    }
}

export interface Message {
    serialize(stream: ReadableMessageStream): void
    visit(messageVisitor: MessageVisitor): void
    asBuffer(): Buffer
    getMessageHeader(): MessageHeader
}

export enum MessageType {
    invalid = 0x0,
    not_a_type = 0x1,
    keepalive = 0x2,
    publish = 0x3,
    confirm_req = 0x4,
    confirm_ack = 0x5,
    bulk_pull = 0x6,
    bulk_push = 0x7,
    frontier_req = 0x8,
    /* deleted 0x9 */
    node_id_handshake = 0x0a,
    bulk_pull_account = 0x0b
}

export class MessageHeader {
    readonly versionMax: UInt8
    readonly versionUsing: UInt8
    readonly versionMin: UInt8
    readonly messageType: MessageType
    readonly extensions: UInt16

    constructor(versionMax: UInt8, versionUsing: UInt8, versionMin: UInt8, messageType: MessageType, extensions: UInt16) {
        this.versionMax = versionMax
        this.versionUsing = versionUsing
        this.versionMin = versionMin
        this.messageType = messageType
        this.extensions = extensions
    }

    serialize(writableStream: NodeJS.WritableStream) {
        writableStream.write(NetworkParams.headerMagicNumber.asBuffer())
        writableStream.write(this.versionMax.asBuffer())
        writableStream.write(this.versionUsing.asBuffer())
        writableStream.write(this.versionMin.asBuffer())
        writableStream.write(Buffer.from([this.messageType]))
        writableStream.write(this.extensions.asBuffer())
    }

    static async from(readableStream: NodeJS.ReadableStream, timeout?: number): Promise<MessageHeader> {
        const messageStream = new ReadableMessageStream(readableStream)
        return MessageDecoder.readMessageHeaderFromStream(messageStream, timeout)
    }
}

export class ReadableMessageStream {
    private readonly readableStream: NodeJS.ReadableStream
    constructor(readableStream: NodeJS.ReadableStream) {
        this.readableStream = readableStream
    }

    async readUInt8(): Promise<UInt8> {
        return new Promise((resolve, reject) => {
            this.readableStream.once('readable', () => {
                const buffer = this.readableStream.read(1) as Buffer
                if(buffer === null) {
                    return resolve(this.readUInt8())
                }
                if(buffer.length !== 1) {
                    return reject(new Error('Unexpected data from stream'))
                }
                resolve(new UInt8({ buffer }))
            })
            this.readableStream.on('end', () => {
                reject(new Error('Stream unexpectedly ended'))
            })
            this.readableStream.on('error', (error) => {
                reject(error)
            })
        })
    }

    async readUInt16(): Promise<UInt16> {
        return new Promise((resolve, reject) => {
            this.readableStream.once('readable', () => {
                const buffer = this.readableStream.read(2) as Buffer
                if(buffer === null) {
                    return resolve(this.readUInt16())
                }
                if(buffer.length !== 2) {
                    return reject(new Error('Unexpected data from stream'))
                }
                resolve(new UInt16({ buffer }))
            })
            this.readableStream.on('end', () => {
                reject(new Error('Stream unexpectedly ended'))
            })
            this.readableStream.on('error', (error) => {
                reject(error)
            })
        })
    }
}

export interface MessageVisitor {

}

export class KeepaliveMessage implements Message {
    private messageHeader = new MessageHeader(MessageType.keepalive) // FIXME
    private readonly peers: Set<UDPEndpoint>

    constructor(peers: Set<UDPEndpoint>) {
        this.peers = peers
    }

    serialize(stream: ReadableMessageStream): void {
        //TODO
    }

    visit(messageVisitor: MessageVisitor): void {
        //TODO
    }

    asBuffer(): Buffer {
        return new Buffer(0) // FIXME
    }

    getPeers(): Set<UDPEndpoint> {
        return this.peers
    }

    getMessageHeader(): MessageHeader {
        return this.messageHeader
    }
}

export class NodeIDHandshakeMessage implements Message {
    constructor(synCookie: SYNCookie) { // FIXME? better id?

    }

    asBuffer(): Buffer {
        return Buffer.alloc(0) // FIXME
    }

    getMessageHeader(): MessageHeader {
        return undefined
    }

    serialize(stream: ReadableMessageStream): void {
    }

    visit(messageVisitor: MessageVisitor): void {
    }
}

namespace Constants {
    export const tcpRealtimeProtocolVersionMin = 0x11
}

export default Constants

namespace MessageDecoder {
    export async function readMessageHeaderFromStream(stream: ReadableMessageStream, timeoutMS?: number): Promise<MessageHeader> {
        return new Promise(async (resolve, reject) => {
            if(timeoutMS) {
                setTimeout(() => reject(), timeoutMS)
            }

            try {
                const magicNumber = await stream.readUInt16()
                if(!magicNumber.equals(NetworkParams.headerMagicNumber)) {
                    return reject(new Error('Invalid magic number'))
                }

                const versionMax = await stream.readUInt8()
                const versionUsing = await stream.readUInt8()
                const versionMin = await stream.readUInt8()
                const messageType: MessageType = (await stream.readUInt8()).asUint8Array()[0] // TODO: validate
                const extensions = await stream.readUInt16()

                resolve(new MessageHeader(
                    versionMax,
                    versionUsing,
                    versionMin,
                    messageType,
                    extensions
                ))
            } catch(error) {
                reject(error)
            }
        })
    }
}
