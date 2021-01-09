import {
    KeepaliveMessage,
    MessageHeader,
    MessageType,
    NodeIDHandshakeMessage,
    ReadableMessageStream
} from '../node/Common'
import {PassThrough} from 'stream'
import {logToFile} from '../debugging'
import SignatureVerifier from './SignatureVerifier'
import verify = SignatureVerifier.verify
import UInt256 from './UInt256'
import UInt512 from './UInt512'
import {SignatureChecker} from '../node/Signatures'

export interface MessageEventListener {
    onKeepalive: (keepaliveMessage: KeepaliveMessage) => void
    onHandshake: (handshakeMessage: NodeIDHandshakeMessage) => void
}

export function parseFrontierReqResponse() {

}

// It is the caller's responsibility to use a stream in the valid state. For example, if the stream closes or
// receives an error, the caller must properly handle this, remove the message parser, and make a
// new one on a new connection/stream.
export class MessageParser {
    constructor(stream: NodeJS.ReadableStream, private readonly messageEventListener: MessageEventListener) {
        stream.on('data', async (data: Buffer) => {
            console.log(`${new Date().toISOString()}: MessageParser on data`)
            logToFile(data, `MessageParser.onData`)
            const header = await MessageHeader.fromBuffer(data)
            console.log(`${new Date().toISOString()}: parsed MessageHeader: ${header}`)
            console.log(`${header}`)
            // TODO: audit; could be a source of bugs if multiple messages were sent and they are consumed at once; we might have to unshift unconsumed data, etc.
            // stream.unshift()

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
                        const handshakeMessage = await NodeIDHandshakeMessage.fromBuffer(header, messageBuffer)
                        messageEventListener.onHandshake(handshakeMessage)
                    } catch (e) {
                        console.log(`${new Date().toISOString()}: error while parsing node_id_handshake: ${e}`)
                        console.log(`${new Date().toISOString()}: error, `, e)
                        logToFile(data, `error-while-parsing-handshake`)
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
