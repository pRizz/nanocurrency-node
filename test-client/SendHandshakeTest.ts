import * as net from 'net'
import {MessageHeader, MessageType, NodeIDHandshakeMessage, NodeIDHandshakeMessageResponse} from '../src/node/Common'
import UInt16 from '../src/lib/UInt16'
import UInt256 from '../src/lib/UInt256'
import * as fs from 'fs'
import NanoSocketClient from '../src/node/NanoProtocol/NanoSocketClient'

function testSendHandshake() {
    console.log(`starting handshake test`)

    const testNanoNodeIP = process.env.TEST_NANO_NODE_IP
    if(!testNanoNodeIP) {
        throw `no TEST_NANO_NODE_IP found in environment`
    }

    if(!net.isIP(testNanoNodeIP)) {
        throw `the TEST_NANO_NODE_IP found in the environment is not an IP Address; see https://nodejs.org/api/net.html#net_net_isip_input`
    }

    console.log(`testing with Node at ${testNanoNodeIP}`)

    const syncPort = 7075

    const clientSocket = net.createConnection({
        host: testNanoNodeIP,
        port: syncPort,
        timeout: 10_000,
    })

    clientSocket.on('lookup', (err, address, family, host) => {
        console.log(`${new Date().toISOString()}: clientSocket.on('lookup'): ${{err, address, family, host}}`)
    })

    clientSocket.on('connect', () => {
        console.log(`${new Date().toISOString()}: clientSocket.on('connect')`)

        const query = new UInt256()
        const handshakeMessage = NodeIDHandshakeMessage.fromQuery(query)

        // clientSocket.write(handshakeMessage.asBuffer())
        // or
        handshakeMessage.serialize(clientSocket)
    })

    clientSocket.on('data', (data: Buffer) => {
        console.log(`${new Date().toISOString()}: clientSocket.on('data'), ${data.length}, ${data}`)
        fs.writeFile(`${new Date().toISOString()}.SendHandshakeTest.bin`, data, (err) => {
            if (err) throw err
            console.log('The response binary has been saved to a file!')
        })
    })

    clientSocket.on('close', had_error => {
        console.log(`${new Date().toISOString()}: clientSocket.on('close'): had_error: ${had_error}`)
    })

    clientSocket.on('error', (err: Error) => {
        console.log(`${new Date().toISOString()}: clientSocket.on('error'): err: ${err}`)
    })

    clientSocket.on('end', () => {
        console.log(`${new Date().toISOString()}: clientSocket.on('end')`)
    })

    clientSocket.on('timeout', () => {
        console.log(`${new Date().toISOString()}: clientSocket.on('timeout')`)
    })

}

function testSendHandshakeWithClient() {
    console.log(`starting testSendHandshakeWithClient, `, process.env.TEST_NANO_NODE_IP)

    const client = new NanoSocketClient({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect() {
            const query = new UInt256()
            const handshakeMessage = NodeIDHandshakeMessage.fromQuery(query)

            handshakeMessage.asBuffer().then(buffer => {
                console.log(`query buffer:`)
                console.log(buffer)
                client.write(buffer)
            })
            // or
            // handshakeMessage.serialize(client.asWritable())
        },
        messageEventListener: {
            onKeepalive(keepaliveMessage) {
                console.log(`${new Date().toISOString()}: onKeepalive`)
                console.log(keepaliveMessage)
            },
            onHandshake(handshakeMessage) {
                console.log(`${new Date().toISOString()}: onHandshake`)
                console.log(handshakeMessage)
            }
        }
    })
}

// testSendHandshake()
testSendHandshakeWithClient()
