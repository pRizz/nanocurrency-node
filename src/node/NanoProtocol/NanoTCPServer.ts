// import {Listener} from '../WebSocket'
import * as net from 'net'
import {AbstractTCPServer} from '../../lib/AbstractTCPServer'
import {KeepaliveMessage, MessageHeader, MessageType, NodeIDHandshakeMessage} from '../Common'
import {MessageParser} from '../../lib/MessageParser'

export interface NetAddr {
    transport: "tcp" | "udp";
    hostname: string;
    port: number;
}

export interface UnixAddr {
    transport: "unix" | "unixpacket";
    address: string;
}

export type Addr = NetAddr | UnixAddr;

// export interface Conn extends Reader, Writer, Closer {
//     localAddr: Addr;
//     remoteAddr: Addr;
//     rid: number;
//     closeRead(): void;
//     closeWrite(): void;
// }

// should use the tcp library, which returns a listener
// interface Listener {
//     accept(): Promise<NanoConnection>
//     close(): void
//     address: Addr
// }

class NanoConnection {
    close() {

    }
}

interface INanoTCPServer {
    close(): void
}

interface OnKeepaliveReq {
    readonly socket: net.Socket
}
interface OnKeepaliveRes {
    write(): void
}
interface OnHandshakeReq {
    readonly socket: net.Socket
}
interface OnHandshakeRes {
    write(): void
}

export interface NanoTCPServerConfig {
    port: number
    // onKeepalive: (req: OnKeepaliveReq, res: OnKeepaliveRes) => void
    // onHandshake: (req: OnHandshakeReq, res: OnHandshakeRes) => void
    // TODO: all the rest
}

export interface ConnectionAndMessageParser {
    readonly connection: net.Socket
    readonly messageParser: MessageParser
}

// inspired by https://github.com/denoland/deno/blob/master/std/http/server.ts
export class NanoTCPServer {
    // private closing = false
    // private readonly connections: net.Socket[] = []
    private readonly connectionsAndParsers: ConnectionAndMessageParser[] = []
    private readonly tcpServer: net.Server

    constructor(private readonly nanoTCPServerConfig: NanoTCPServerConfig) {
        this.tcpServer = net.createServer({})

        this.tcpServer.on('close', () => {
            console.log(`${new Date().toISOString()}: NanoTCPServer: got closed event`)
        })

        this.tcpServer.on('connection', (connection) => {
            console.log(`${new Date().toISOString()}: NanoTCPServer: got connection event`)
            this.connectionHandler(connection)
        })

        this.tcpServer.on('error', (error) => {
            console.error(`${new Date().toISOString()}: NanoTCPServer: got error event:`, error)
            // FIXME
            if (error.code === 'EADDRINUSE') {
                console.error(`${new Date().toISOString()}: NanoTCPServer: address already in use`)
                this.close()
            }
        })

        this.tcpServer.on('listening', () => {
            console.log(`${new Date().toISOString()}: NanoTCPServer: got listening event`)
        })

        this.start()
    }

    start() {
        if(this.tcpServer.listening) {
            console.warn(`${new Date().toISOString()}: NanoTCPServer: the server is already listening`)
            return
        }

        this.tcpServer.listen({
            port: this.nanoTCPServerConfig.port
        })
    }

    private connectionHandler(connection: net.Socket) {
        const messageParser = new MessageParser(connection, {
            onHandshake(handshakeMessage: NodeIDHandshakeMessage){
                console.log(`${new Date().toISOString()}: ${connection.remoteAddress}:${connection.remotePort}: onHandshake()`)
            },
            onKeepalive(keepaliveMessage: KeepaliveMessage){
                console.log(`${new Date().toISOString()}: ${connection.remoteAddress}:${connection.remotePort}: onKeepalive()`)
            },
        })
        connection.setTimeout(3000, () => {
            console.log(`${new Date().toISOString()}: connection on timeout`)
        })
        this.connectionsAndParsers.push({connection, messageParser})
    }

    // private closeConnection(connection: net.Socket) {
    //     connection.end()
    // }

    private close() {
        console.log(`${new Date().toISOString()}: NanoTCPServer: close() called`)
        // this.closing = true
        this.tcpServer.close()
        // this.connections.forEach(this.closeConnection)
        this.connectionsAndParsers.map(cAP => cAP.connection).forEach(net.Socket.prototype.end.bind) // TODO: test
        // TODO: unref all sockets?
        this.connectionsAndParsers.splice(0, this.connectionsAndParsers.length)
        this.tcpServer.unref()
    }

    stop() {
        console.log(`${new Date().toISOString()}: NanoTCPServer: stop() called`)
        this.close()
    }
}
