// import {Listener} from '../WebSocket'
import * as net from 'net'
import {AbstractTCPServer} from '../../lib/AbstractTCPServer'
import {MessageHeader, MessageType} from '../Common'

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

interface NanoTCPServerConfig {
    port: number
    onKeepalive: (req: OnKeepaliveReq, res: OnKeepaliveRes) => void
    onHandshake: (req: OnHandshakeReq, res: OnHandshakeRes) => void
    // TODO: all the rest
}

// inspired by https://github.com/denoland/deno/blob/master/std/http/server.ts
class NanoTCPServer {
    // private closing = false
    private readonly connections: net.Socket[] = []
    private readonly tcpServer: net.Server

    constructor(private readonly nanoTCPServerConfig: NanoTCPServerConfig) {
        this.tcpServer = net.createServer({})

        this.tcpServer.on('close', () => {
            console.log(`${new Date().toISOString()}: NanoTCPServer: got closed event`)
        })

        this.tcpServer.on('connection', (connection) => {
            console.log(`${new Date().toISOString()}: NanoTCPServer: got connection event`)
            this.connections.push(connection)
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

        this.tcpServer.listen({
            port: nanoTCPServerConfig.port
        })
    }

    private connectionHandler(connection: net.Socket) {
        connection.setTimeout(3000, () => {
            console.log(`${new Date().toISOString()}: connection on timeout`)
        })
        connection.on('data', async (data: Buffer) => {
            console.log(`${new Date().toISOString()}: connection on data`)
            const header = await MessageHeader.fromBuffer(data)
            // TODO: check what kind of message this is and parse accordingly
        })
    }

    // private closeConnection(connection: net.Socket) {
    //     connection.end()
    // }

    private close() {
        console.log(`${new Date().toISOString()}: NanoTCPServer: close() called`)
        // this.closing = true
        this.tcpServer.close()
        // this.connections.forEach(this.closeConnection)
        this.connections.forEach(net.Socket.prototype.end.bind) // TODO: test
        // TODO: unref all sockets?
        this.connections.splice(0, this.connections.length)
        this.tcpServer.unref()
    }

    stop() {
        console.log(`${new Date().toISOString()}: NanoTCPServer: stop() called`)
        this.close()
    }
}

// inspiration from https://github.com/http-kit/http-kit/blob/master/src/org/httpkit/server.clj
// https://github.com/http-kit/http-kit/blob/master/src/java/org/httpkit/server/HttpServer.java

export function runServer(): {stop: () => Boolean} {
    const server = new NanoTCPServer()

    return {
        stop() {
            server.stop()
            return true
        }
    }
}

export class NanoTCPServer2 {
    private readonly tcpServer = new AbstractTCPServer({
        port: 5555,
        messageDefinitions: [],
        eventListener: this,
    })

    constructor() {
    }

    start() {
        this.tcpServer.start()
    }

    stop() {
        this.tcpServer.stop()
    }

    onError() {

    }
}
