import {
    KeepaliveMessage,
    MessageHeader,
    MessageType,
    NodeIDHandshakeMessage,
    ReadableMessageStream
} from '../node/Common'
import {PassThrough} from 'stream'
import {logToFile} from '../debugging'

export interface MessageEventListener {
    onKeepalive: (keepaliveMessage: KeepaliveMessage) => void
    onHandshake: (handshakeMessage: NodeIDHandshakeMessage) => void
}

// It is the caller's responsibility to use a stream in the valid state. For example, if the stream closes or
// receives an error, the caller must properly handle this, remove the message parser, and make a
// new one on a new connection/stream.
export class MessageParser {
    constructor(stream: NodeJS.ReadableStream, private readonly messageEventListener: MessageEventListener) {
        stream.on('data', async (data: Buffer) => {
            console.log(`${new Date().toISOString()}: connection on data`)
            logToFile(data)
            const header = await MessageHeader.fromBuffer(data)
            console.log(`${new Date().toISOString()}: parsed MessageHeader: ${header}`)
            console.log(`${header}`)

            switch (header.messageType) {
                case MessageType.invalid:
                    console.log(`${new Date().toISOString()}: MessageType.invalid`)
                    break;
                case MessageType.not_a_type:
                    console.log(`${new Date().toISOString()}: MessageType.not_a_type`)
                    break;
                case MessageType.keepalive:
                    console.log(`${new Date().toISOString()}: MessageType.keepalive`)
                    break;
                case MessageType.publish:
                    console.log(`${new Date().toISOString()}: MessageType.publish`)
                    break;
                case MessageType.confirm_req:
                    console.log(`${new Date().toISOString()}: MessageType.confirm_req`)
                    break;
                case MessageType.confirm_ack:
                    console.log(`${new Date().toISOString()}: MessageType.confirm_ack`)
                    break;
                case MessageType.bulk_pull:
                    console.log(`${new Date().toISOString()}: MessageType.bulk_pull`)
                    break;
                case MessageType.bulk_push:
                    console.log(`${new Date().toISOString()}: MessageType.bulk_push`)
                    break;
                case MessageType.frontier_req:
                    console.log(`${new Date().toISOString()}: MessageType.frontier_req`)
                    break;
                case MessageType.node_id_handshake:
                    console.log(`${new Date().toISOString()}: MessageType.node_id_handshake`)
                    try {
                        const messageBuffer = data.slice(8)
                        const messageStream = new PassThrough()
                        messageStream.write(messageBuffer)
                        logToFile(messageBuffer)
                        const readableMessageStream = new ReadableMessageStream(messageStream)
                        const handshakeMessage = await NodeIDHandshakeMessage.from(header, readableMessageStream)
                        console.log(handshakeMessage)
                        console.log(handshakeMessage.response)
                        console.log(handshakeMessage.response?.account)
                        console.log(handshakeMessage.response?.account.toNANOAddress())
                        console.log(handshakeMessage.response?.signature)
                        console.log(handshakeMessage.response?.signature.value.asBuffer().toString('hex'))
                        messageEventListener.onHandshake(handshakeMessage)
                    } catch (e) {
                        console.log(`${new Date().toISOString()}: error while parsing node_id_handshake`)
                    }
                    break;
                case MessageType.bulk_pull_account:
                    console.log(`${new Date().toISOString()}: MessageType.bulk_pull_account`)
                    break;
            }

            // TODO: check what kind of message this is and parse accordingly
        })
    }
}
