import {NetworkParams} from '../secure/Common'
import UInt8 from '../lib/UInt8'
import UInt16 from '../lib/UInt16'
import {UnsignedInteger, UnsignedIntegerType} from '../lib/UnsignedInteger'
import UInt256 from '../lib/UInt256'
import Account from '../lib/Account'
import UInt512 from '../lib/UInt512'
import {Signature} from '../lib/Numbers'
import {Serializable} from './Socket'
import {PassThrough} from "stream"

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

export interface Message extends Serializable {
    visit(messageVisitor: MessageVisitor): void
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

export class MessageHeader implements Serializable {
    static readonly nodeIDHandshakeQueryFlagPosition = 0
    static readonly nodeIDHandshakeResponseFlagPosition = 1

    readonly versionMax: UInt8
    readonly versionUsing: UInt8
    readonly versionMin: UInt8
    readonly messageType: MessageType
    readonly extensions: UInt16

    constructor(messageType: MessageType, extensions: UInt16, versionMax?: UInt8, versionUsing?: UInt8, versionMin?: UInt8) {
        this.versionMax = versionMax || Constants.protocolVersion
        this.versionUsing = versionUsing || Constants.protocolVersion
        this.versionMin = versionMin || Constants.protocolVersionMin
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

    nodeIDHandshakeIsQuery(): boolean {
        if(this.messageType !== MessageType.node_id_handshake) {
            return false
        }
        return this.hasFlag(MessageHeader.nodeIDHandshakeQueryFlagPosition)
    }

    nodeIDHandshakeIsResponse(): boolean {
        if(this.messageType !== MessageType.node_id_handshake) {
            return false
        }
        return this.hasFlag(MessageHeader.nodeIDHandshakeResponseFlagPosition)
    }

    private hasFlag(flagPosition: number): boolean {
        return (this.extensions.asBuffer().readUInt16BE(0) & (1 << flagPosition)) !== 0
    }
}

export class ReadableMessageStream {
    private readonly readableStream: NodeJS.ReadableStream
    constructor(readableStream: NodeJS.ReadableStream) {
        this.readableStream = readableStream
    }

    async readUInt<UInt extends UnsignedInteger>(uintType: UnsignedIntegerType<UInt>): Promise<UInt> {
        return new Promise((resolve, reject) => {
            this.readableStream.once('readable', () => {
                const buffer = this.readableStream.read(uintType.getByteCount()) as Buffer
                if(buffer === null) {
                    return resolve(this.readUInt(uintType))
                }
                if(buffer.length !== uintType.getByteCount()) {
                    return reject(new Error('Unexpected data from stream'))
                }
                resolve(new uintType({ buffer }))
            })
            this.readableStream.once('end', () => {
                reject(new Error('Stream unexpectedly ended'))
            })
            this.readableStream.once('error', (error) => {
                reject(error)
            })
        })
    }
}

export interface MessageVisitor {

}

export class KeepaliveMessage implements Message {
    private messageHeader = new MessageHeader(MessageType.keepalive, new UInt16()) // FIXME
    private readonly peers: Set<UDPEndpoint>

    constructor(peers: Set<UDPEndpoint>) {
        this.peers = peers
    }

    serialize(stream: NodeJS.WritableStream): void {
        //TODO
    }

    visit(messageVisitor: MessageVisitor): void {
        //TODO
    }

    getPeers(): Set<UDPEndpoint> {
        return this.peers
    }

    getMessageHeader(): MessageHeader {
        return this.messageHeader
    }
}

export class NodeIDHandshakeMessageResponse {
    readonly account: Account
    readonly signature: Signature

    constructor(account: Account, signature: Signature) {
        this.account = account
        this.signature = signature
    }

    serialize(stream: NodeJS.WritableStream): void {
        stream.write(this.account.publicKey.asBuffer())
        stream.write(this.signature.value.asBuffer())
    }
}

export class NodeIDHandshakeMessage implements Message {
    readonly messageHeader: MessageHeader
    readonly query?: UInt256
    readonly response?: NodeIDHandshakeMessageResponse

    private constructor(messageHeader: MessageHeader, query?: UInt256, response?: NodeIDHandshakeMessageResponse) {
        this.messageHeader = messageHeader
        this.query = query
        this.response = response
    }

    static fromQuery(query: UInt256): NodeIDHandshakeMessage {
        const extensionsUInt = 1 << MessageHeader.nodeIDHandshakeQueryFlagPosition
        const extensionsBuffer = Buffer.alloc(2)
        extensionsBuffer.writeUInt16BE(extensionsUInt, 0)
        const extensions = new UInt16({ buffer: extensionsBuffer })

        const messageHeader = new MessageHeader(MessageType.node_id_handshake, extensions)

        return new NodeIDHandshakeMessage(messageHeader, query)
    }

    static fromResponse(response: NodeIDHandshakeMessageResponse) {
        const extensionsUInt = 1 << MessageHeader.nodeIDHandshakeResponseFlagPosition
        const extensionsBuffer = Buffer.alloc(2)
        extensionsBuffer.writeUInt16BE(extensionsUInt, 0)
        const extensions = new UInt16({ buffer: extensionsBuffer })

        const messageHeader = new MessageHeader(MessageType.node_id_handshake, extensions)

        return new NodeIDHandshakeMessage(messageHeader, undefined, response)
    }

    getMessageHeader(): MessageHeader {
        return this.messageHeader
    }

    serialize(stream: NodeJS.WritableStream): void {
        this.messageHeader.serialize(stream)
        if(this.query) {
            stream.write(this.query.asBuffer())
        }
        if(this.response) {
            this.response.serialize(stream)
        }
    }

    visit(messageVisitor: MessageVisitor): void {
    }

    static async from(header: MessageHeader, stream: ReadableMessageStream, timeoutMS?: number): Promise<NodeIDHandshakeMessage> {
        if(header.messageType !== MessageType.node_id_handshake) {
            return Promise.reject(new Error(`Unexpected message header`))
        }

        return new Promise(async (resolve, reject) => {
            if(timeoutMS) {
                setTimeout(() => reject(new Error(`Timeout while attempting to read NodeIDHandshakeMessage`)), timeoutMS)
            }

            try {
                let query: UInt256 | undefined
                if(header.nodeIDHandshakeIsQuery()) {
                    query = await stream.readUInt(UInt256)
                }

                let messageResponse: NodeIDHandshakeMessageResponse | undefined
                if(header.nodeIDHandshakeIsResponse()) {
                    const account = new Account(await stream.readUInt(UInt256))
                    const signature = new Signature(await stream.readUInt(UInt512))
                    messageResponse = new NodeIDHandshakeMessageResponse(account, signature)
                }

                resolve(new NodeIDHandshakeMessage(header, query, messageResponse))
            } catch(error) {
                reject(error)
            }
        })
    }
}

namespace Constants {
    export const tcpRealtimeProtocolVersionMin = 0x11
    export const protocolVersion = new UInt8({ octetArray: [0x11] })
    export const protocolVersionMin = new UInt8({ octetArray: [0x0d] })
    export const blockProcessorBatchSize = 10000 // FIXME

    export function getVersion(): string {
        return '1.0.0' // FIXME
    }
}

export default Constants

namespace MessageDecoder {
    export async function readMessageHeaderFromStream(stream: ReadableMessageStream, timeoutMS?: number): Promise<MessageHeader> {
        return new Promise(async (resolve, reject) => {
            if(timeoutMS) {
                setTimeout(() => reject(), timeoutMS)
            }

            try {
                const magicNumber = await stream.readUInt(UInt16)
                if(!magicNumber.equals(NetworkParams.headerMagicNumber)) {
                    return reject(new Error('Invalid magic number'))
                }

                const versionMax = await stream.readUInt(UInt8)
                const versionUsing = await stream.readUInt(UInt8)
                const versionMin = await stream.readUInt(UInt8)
                const messageType: MessageType = (await stream.readUInt(UInt8)).asUint8Array()[0] // TODO: validate
                const extensions = await stream.readUInt(UInt16)

                resolve(new MessageHeader(
                    messageType,
                    extensions,
                    versionMax,
                    versionUsing,
                    versionMin,
                ))
            } catch(error) {
                reject(error)
            }
        })
    }
}

export async function bufferFromSerializable(serializable: Serializable): Promise<Buffer> {
    const passThroughStream = new PassThrough()
    serializable.serialize(passThroughStream)
    passThroughStream.end()

    return new Promise((resolve, reject) => {
        let messageBuffer = Buffer.alloc(0)
        passThroughStream.on('readable', () => {
            let buffer: Buffer
            while(buffer = passThroughStream.read()) {
                messageBuffer = Buffer.concat([messageBuffer, buffer])
            }
        })
        passThroughStream.once('end', () => {
            resolve(messageBuffer)
        })
        passThroughStream.once('error', (error) => {
            reject(error)
        })
    })
}
