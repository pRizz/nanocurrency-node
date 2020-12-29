import {KeyPair} from '../src/secure/Common'
import Account from '../src/lib/Account'
import NanoSocketClient from '../src/node/NanoProtocol/NanoSocketClient'
import {IPAddress, KeepaliveMessage, NodeIDHandshakeMessage, TCPEndpoint} from '../src/node/Common'
import {IPv6} from 'ipaddr.js'

function testSendKeepalive() {
    console.log(`starting testSendKeepalive, `, process.env.TEST_NANO_NODE_IP)

    const randomKeyPair = KeyPair.createRandomKeyPair()
    const account = new Account(randomKeyPair.publicKey.value)
    console.log(`created randomKeyPair with nano address: ${account.toNANOAddress()}`)

    const nanoSocketClient = new NanoSocketClient({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect(){
            const peers = new Set(Array.from({length: 8}).map(() =>
                new TCPEndpoint(
                    new IPAddress(
                        IPv6.parse("::") // unspecified address
                    ), 7075
                )
            ))
            const keepaliveMessage = new KeepaliveMessage(peers)
            nanoSocketClient.sendMessage(keepaliveMessage)
            console.log(`${new Date().toISOString()}: sent keepalive`)
        },
        messageEventListener: {
            onHandshake(handshakeMessage: NodeIDHandshakeMessage): void {
                console.log(`${new Date().toISOString()}: messageEventListener.onHandshake`, handshakeMessage)
            },
            onKeepalive(keepaliveMessage: KeepaliveMessage): void {
                console.log(`${new Date().toISOString()}: messageEventListener.onKeepalive`, keepaliveMessage)
            }
        }
    })
}

testSendKeepalive()
