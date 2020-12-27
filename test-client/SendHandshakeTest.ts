import * as net from 'net'
import {MessageHeader, MessageType, NodeIDHandshakeMessage, NodeIDHandshakeMessageResponse} from '../src/node/Common'
import UInt16 from '../src/lib/UInt16'
import UInt256 from '../src/lib/UInt256'
import * as fs from 'fs'
import NanoSocketClient from '../src/node/NanoProtocol/NanoSocketClient'
import {SignatureChecker} from '../src/node/Signatures'
import SignatureVerifier from '../src/lib/SignatureVerifier'
import {logToFile} from '../src/debugging'
import {KeyPair} from '../src/secure/Common'
import Account from '../src/lib/Account'
import MessageSigner from '../src/lib/MessageSigner'
import UInt512 from '../src/lib/UInt512'

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

    const randomKeyPair = KeyPair.createRandomKeyPair()
    const account = new Account(randomKeyPair.publicKey.value)
    console.log(`created randomKeyPair with nano address: ${account.toNANOAddress()}`)

    const client = new NanoSocketClient({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect() {
            const query = new UInt256()
            const handshakeMessage = NodeIDHandshakeMessage.fromQuery(query)

            handshakeMessage.asBuffer().then(buffer => {
                console.log(`query buffer:`)
                console.log(buffer)
                client.sendMessage(handshakeMessage)
            })
        },
        messageEventListener: {
            onKeepalive(keepaliveMessage) {
                console.log(`${new Date().toISOString()}: onKeepalive`)
                console.log(keepaliveMessage)
            },
            onHandshake(handshakeMessage) {
                console.log(`${new Date().toISOString()}: onHandshake`)
                console.log(handshakeMessage)
                if(handshakeMessage.query) {
                    // FIXME: only send query response if either there was no response or there is a verified response
                    // send signed response

                    const signedQuery = MessageSigner.sign(randomKeyPair.privateKey.value, handshakeMessage.query.asBuffer())
                    logToFile(randomKeyPair.privateKey.value.asBuffer(), `randomKeyPair.privateKey.value`)
                    logToFile(account.toNANOAddress(), `account.toNANOAddress`)
                    logToFile(handshakeMessage.query.asBuffer(), `handshakeMessage.query`)
                    logToFile(signedQuery.value.asBuffer(), `signedQuery`)

                    const signedResponse = new NodeIDHandshakeMessageResponse(account, signedQuery)
                    const signedHandshakeMessage = NodeIDHandshakeMessage.fromResponse(signedResponse)
                    signedHandshakeMessage.asBuffer().then(buf => {
                        logToFile(buf, `sent-signedHandshakeMessage`)
                    })
                    client.sendMessage(signedHandshakeMessage)
                    console.log(`${new Date().toISOString()}: sent signedHandshakeMessage`)
                }
                if(handshakeMessage.response) {
                    // FIXME: should use the actual challenge sent which will be a random filled SYNCookie
                    const isSignatureVerified = SignatureChecker.verifyHandshakeResponse(new UInt256(), handshakeMessage.response)
                    console.log(`isSignatureVerified`)
                    console.log(isSignatureVerified)
                    // FIXME: handle verification

                    handshakeMessage.asBuffer().then(data => {logToFile(data, `handshakeMessage`)})
                    logToFile(handshakeMessage.query?.asBuffer() || '', `query`)
                    logToFile(handshakeMessage.response?.account.publicKey.asBuffer() || '', `handshakeMessage.response.account`)
                    logToFile(handshakeMessage.response?.signature.value.asBuffer() || '', `handshakeMessage.response.signature`)
                } else {
                    console.log(`no response`)
                }
            }
        }
    })
}

// testSendHandshake()
testSendHandshakeWithClient()
