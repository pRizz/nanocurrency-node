import {EventEmitter} from 'events'
import {ConfirmReqMessage, KeepaliveMessage, NodeIDHandshakeMessage} from '../Common'
import * as net from "net"
import UInt256 from '../../lib/UInt256'
import * as fs from "fs"
import {MessageEventListener, MessageParser} from '../../lib/MessageParser'
import {Writable} from 'stream'

// modeled after a WebSocket, but handles Nano-protocol specific messages
// export interface NanoSocketDelegate {
//     onKeepaliveMessage(keepaliveMessage: KeepaliveMessage): void
//     onConfirmReqMessage(confirmReqMessage: ConfirmReqMessage): void
//     onNodeIDHandshakeMessage(nodeIDHandshakeMessage: NodeIDHandshakeMessage): void
//     // TODO: messages from Common.ts
// }

export interface NanoSocketClientConfig {
    remoteHost: string
    remotePort?: number
    onConnect: () => void
    messageEventListener: MessageEventListener
}

export default class NanoSocketClient {
    private readonly clientSocket: net.Socket
    constructor(private readonly nanoSocketClientConfig: NanoSocketClientConfig) {
        // TODO: check if remoteHost is an ip or hostname

        const syncPort = nanoSocketClientConfig.remotePort || 7075

        this.clientSocket = net.createConnection({
            host: nanoSocketClientConfig.remoteHost,
            port: syncPort,
            timeout: 10_000,
        })

        const messageParser = new MessageParser(this.clientSocket, nanoSocketClientConfig.messageEventListener)

        this.clientSocket.on('lookup', (err, address, family, host) => {
            console.log(`${new Date().toISOString()}: clientSocket.on('lookup'): ${{err, address, family, host}}`)
        })

        this.clientSocket.on('connect', () => {
            console.log(`${new Date().toISOString()}: clientSocket.on('connect')`)
            nanoSocketClientConfig.onConnect()
        })

        this.clientSocket.on('data', (data: Buffer) => {
            console.log(`${new Date().toISOString()}: clientSocket.on('data'), ${data.length}, ${data}`)
        })

        this.clientSocket.on('close', had_error => {
            console.log(`${new Date().toISOString()}: clientSocket.on('close'): had_error: ${had_error}`)
        })

        this.clientSocket.on('error', (err: Error) => {
            console.log(`${new Date().toISOString()}: clientSocket.on('error'): err: ${err}`)
        })

        this.clientSocket.on('end', () => {
            console.log(`${new Date().toISOString()}: clientSocket.on('end')`)
        })

        this.clientSocket.on('timeout', () => {
            console.log(`${new Date().toISOString()}: clientSocket.on('timeout')`)
        })
    }

    asWritable(): NodeJS.WritableStream {
        return this.clientSocket
    }

    write(buffer: Buffer): boolean {
        return this.clientSocket.write(buffer)
    }
}
