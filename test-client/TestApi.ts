import {
    bufferFromSerializable,
    ConfirmReqMessage,
    Endpoint,
    IPAddress, KeepaliveMessage, MessageHeader,
    NodeIDHandshakeMessage, NodeIDHandshakeMessageResponse, ReadableMessageStream,
    TCPEndpoint,
    UDPEndpoint
} from '../src/node/Common'
import Block from '../src/lib/Block'
import {ChannelTCP, TCPChannels, TCPChannelsDelegate} from '../src/node/transport/TCP'
import {Signature} from '../src/lib/Numbers'
import UInt512 from '../src/lib/UInt512'
import Account from '../src/lib/Account'
import {IPv4, IPv6} from "ipaddr.js"
import UInt256 from '../src/lib/UInt256'
import {Network, SYNCookie, SYNCookieInfo} from '../src/node/Network'
import * as moment from 'moment'
import {Socket} from "net"
import { Readable } from 'stream'
import {SignatureChecker} from '../src/node/Signatures'
import {SignatureVerification} from '../src/secure/Common'
import SignatureVerifier from '../src/lib/SignatureVerifier'

const testNodeIP = "18.218.157.99"
const livePeerNetworkDomain = "peering.nano.org"
const livePeerNetworkIP = "139.180.168.194"
const activeIP = testNodeIP

const testNodePort = 7075
const net = require('net')

const preconfiguredRepPublicKeys = [
    "A30E0A32ED41C8607AA9212843392E853FCBCB4E7CB194E35C94F07F91DE59EF",
    "67556D31DDFC2A440BF6147501449B4CB9572278D034EE686A6BEE29851681DF",
    "5C2FBB148E006A8E8BA7A75DD86C9FE00C83F5FFDBFD76EAA09531071436B6AF",
    "AE7AC63990DAAAF2A69BF11C913B928844BF5012355456F2F164166464024B29",
    "BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA",
    "2399A083C600AA0572F5E36247D978FCFC840405F8D4B6D33161C0066A55F431",
    "2298FAB7C61058E77EA554CB93EDEEDA0692CBFCC540AB213B2836B29029E23A",
    "3FE80B4BC842E82C1C18ABFEEC47EA989E63953BC82AC411F304D13833D52A56",
]

const testRepPublicKey = "BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA"

function getRandomBlock(): Block {
    // return new Block
}

class FakeTCPChannelsDelegate implements TCPChannelsDelegate {
    bootstrapPeer(protocolVersionMin: number): TCPEndpoint {
        return new TCPEndpoint(new IPAddress(IPv6.parse("::1")), testNodePort);
    }

    getAccountCookieForEndpoint(endpoint: Endpoint): Account {
        return new Account(new UInt256());
    }

    getNodeID(): Account {
        return new Account(new UInt256());
    }

    getPrivateKey(): UInt512 {
        return new UInt512();
    }

    getRandomPeers(): Set<UDPEndpoint> {
        return new Set();
    }

    getUDPChannelCount(): number {
        return 0;
    }

    hasNode(nodeID: Account): boolean {
        return false;
    }

    hasPeer(endpoint: UDPEndpoint | undefined, allowLocalPeers: boolean): boolean {
        return false;
    }

    isLocalPeersAllowed(): boolean {
        return false;
    }

    isNodeValid(endpoint: TCPEndpoint, nodeID: Account, signature: Signature): boolean {
        return false;
    }

    startTCPReceiveNodeID(channel: ChannelTCP, endpoint: Endpoint, receiveBuffer: Buffer, callback: () => void): void {
        console.log(`${new Date().toISOString()}: in startTCPReceiveNodeID: channel: `, channel, endpoint)
        callback()
    }

    tcpSocketConnectionFailed(): void {
        console.log(`${new Date().toISOString()}: in tcpSocketConnectionFailed: channel: `)
    }

}

function generateRandomBlock(): UInt256 {
    return UInt256.getRandom()
}

function createHandshakeMessage(): NodeIDHandshakeMessage {
    const query = generateRandomBlock()
    const cookie = new SYNCookie(query)

    return NodeIDHandshakeMessage.fromCookie(cookie)
}

export function testSendKeepalive() {
    testHandshakeRequestAndResponse().then()

    return;

    (async () => {
        const handshakeMessage = createHandshakeMessage()
        // const handshakeMessageBuffer = await bufferFromSerializable(handshakeMessage)

        const keepaliveMessage = new KeepaliveMessage(new Set())
        const keepaliveMessageBuffer = await bufferFromSerializable(keepaliveMessage)


        console.log(`${new Date().toISOString()}: send keepaliveMessage.getPeers().size `, keepaliveMessage.getPeers().size)
        console.log(`${new Date().toISOString()}: send keepaliveMessageBuffer.length `, keepaliveMessageBuffer.length)
        console.log(`${new Date().toISOString()}: send keepaliveMessageBuffer `, keepaliveMessageBuffer)
        // console.log(`${new Date().toISOString()}: send handshakeMessageBuffer `, handshakeMessageBuffer)
// 144 	static size_t constexpr size = 8 * (16 + 2);; expect 152?
    })()

    /*
    *
    * 					node_l->network.tcp_channels.start_tcp (endpoint, [node_w](std::shared_ptr<nano::transport::channel> channel_a) {
                            if (auto node_l = node_w.lock ())
                            {
                                node_l->network.send_keepalive (channel_a);
                            }
                        });
    * */


    // const network = new Network(true, testNodePort, new FakeTCPChannelsDelegate(), new FakeTCPChannelsDelegate())

    // const tcpEndpoint = new TCPEndpoint(new IPAddress(IPv4.parse(livePeerNetworkIP).toIPv4MappedAddress()), testNodePort)

    const nodeServer = net.createServer((socket: Socket) => {
        console.log(`${new Date().toISOString()}: server new connection `)
        socket.on('data', (data) => {
            console.log(`${new Date().toISOString()}: server client got data `, data)
        })
        socket.on('end', () => {
            console.log(`${new Date().toISOString()}: server client end `)
        })
    })

    nodeServer.on('error', (error: Error) => {
        console.log(`${new Date().toISOString()}: server error `, error)
    })

    nodeServer.on('close', () => {
        console.log(`${new Date().toISOString()}: server close `)
    })

    nodeServer.on('connection', () => {
        console.log(`${new Date().toISOString()}: server connection `)
    })

    nodeServer.listen(7075, () => {
        console.log(`${new Date().toISOString()}: server listen called `)
    })

    const nodeSocket = net.createConnection({
        host: activeIP,
        port: testNodePort,
        readable: true,
        writable: true,
        timeout: 10000
    }, async () => {
        console.log(`${new Date().toISOString()}: connected to node! `)
    })

    nodeSocket.on('timeout', () => {
        console.log(`${new Date().toISOString()}: node on timeout `)
    })

    nodeSocket.on('ready', async () => {
        console.log(`${new Date().toISOString()}: node on ready `)

        const handshakeMessage = createHandshakeMessage()
        const handshakeMessageBuffer = await bufferFromSerializable(handshakeMessage)

        const keepaliveMessage = new KeepaliveMessage(new Set())
        const keepaliveMessageBuffer = await bufferFromSerializable(keepaliveMessage)


        console.log(`${new Date().toISOString()}: send keepaliveMessageBuffer.length `, keepaliveMessageBuffer.length)
        console.log(`${new Date().toISOString()}: send keepaliveMessageBuffer `, keepaliveMessageBuffer)
        console.log(`${new Date().toISOString()}: send handshakeMessageBuffer.length `, handshakeMessageBuffer.length)
        console.log(`${new Date().toISOString()}: send handshakeMessageBuffer `, handshakeMessageBuffer.toString('hex'))

        nodeSocket.write(keepaliveMessageBuffer)

        nodeSocket.write(handshakeMessageBuffer)

        setInterval(async () => {
            nodeSocket.write(await bufferFromSerializable(keepaliveMessage))
            console.log(`${new Date().toISOString()}: send keepaliveMessageBuffer `, keepaliveMessageBuffer)
        }, 2500)
    })

    nodeSocket.on('error', (error: Error) => {
        console.log(`${new Date().toISOString()}: node on error `, error)
    })

    nodeSocket.on('end', () => {
        console.log(`${new Date().toISOString()}: node on end `)
    })

    nodeSocket.on('connect', () => {
        console.log(`${new Date().toISOString()}: node on connect    `)
    })

    nodeSocket.on('data', (data: any) => {
        console.log(`${new Date().toISOString()}: node on data `, data)
        console.log(`${new Date().toISOString()}: node on data `, (data as Buffer).toString('hex'))
    })

    nodeSocket.on('drain', () => {
        console.log(`${new Date().toISOString()}: node on drain `)
    })

    nodeSocket.on('close', (hadError: boolean) => {
        console.log(`${new Date().toISOString()}: node on close `, hadError)
    })

    // setTimeout(() => {
    //     // nodeConnection.write()
    // }, 15000)


    // network.tcpChannels.startTCPConnection(tcpEndpoint, channel => {
    //     console.log(`${new Date().toISOString()}: in startTCPConnection callback: channel: `, channel)
    //     network.sendKeepalive(channel)
    // }).then(value => {
    //     console.log(`${new Date().toISOString()}: in startTCPConnection then: channel: `, value)
    // }).catch(reason => {
    //     console.log(`${new Date().toISOString()}: in startTCPConnection catch: reason: `, reason)
    // })

    console.log(`${new Date().toISOString()}: done with test `)
}

export function testHandshake() {

}

export function testConfirmReq() {
    const confirmReqType = 0x4
    const messageObject = {}

    const block = getRandomBlock()

    const confirmReqMessage = new ConfirmReqMessage()

    const nodeConnection = net.createConnection({
        host: testNodeIP,
        port: testNodePort,
        readable: true,
        writable: true,
        timeout: 10000
    }, () => {

    })

    setTimeout(() => {
        // nodeConnection.write()
    }, 15000)
}

function readableStreamFromBuffer(buffer: Buffer): NodeJS.ReadableStream {
    // const buffer = new Buffer(img_string, 'base64')
    const readable = new Readable()
    readable._read = () => {} // _read is required but you can noop it
    readable.push(buffer)
    readable.push(null)
    return readable
    // readable.pipe(consumer) // consume the stream
}

export async function testHandshakeRequestAndResponse() {
    // const readableHandshakeMessageStream = readableStreamFromBuffer(Buffer.from('52431111100a0300b06280a639b6d768703c1cb0c63a0399f8ce19f1459970a014fb809650e26bc87d7f565a46405c8acb8334d58e6782c4b451c909b2e40e537b956a4d46d9af2dcbe9d69b6026ebe6d146fb3fd95e672c850ecb4772b0da2437261a9d5b84ab625f1089cdaa266d1c4e8ca499e0f21e3f00bfb71f79f216019f17c70b1886de03', 'hex'))
    // const readableMessageStream = new ReadableMessageStream(readableHandshakeMessageStream)
    // const responseHeader = await MessageHeader.from(readableHandshakeMessageStream, 500)
    // // console.log(`${new Date().toISOString()}: responseHeader `, responseHeader)
    // const handshakeResponse = await NodeIDHandshakeMessage.from(responseHeader, readableMessageStream, 500)
    // // console.log(`${new Date().toISOString()}: handshakeResponse `, handshakeResponse)
    // console.log(`${new Date().toISOString()}: handshakeResponse.account `, handshakeResponse.response && handshakeResponse.response.account.toNANOAddress())
    // console.log(`${new Date().toISOString()}: handshakeResponse.account.asBuffer `, handshakeResponse.response && handshakeResponse.response.account.publicKey.asBuffer().toString('hex'))
    // console.log(`${new Date().toISOString()}: handshakeResponse.signature `, handshakeResponse.response && handshakeResponse.response.signature)

    const message = Buffer.from('434efc904f311a1d9bc4f9b5c2172d447d1611de7b94d2875ff19e8f1157db52', 'hex')
    const signatureBuffer = Buffer.from('7e95f882b05fb667ce63c65553683acecbeb6623b2719e23a14fcff1e185617d4ffb180a2af4c979d79648a81f8c3b652efc97d58a0f261d0686f6640d3f880a', 'hex')
    const publicKey = new UInt256({buffer: Buffer.from('2f72e664d5efcf74227ab9638a66705a347b87bc4a6bbc6e77fd2a5c1775e3c7', 'hex')})

    const isVerified = SignatureVerifier.verify(
        message,
        // signature, 512 bit
        signatureBuffer,
        // public key 256 bit
        publicKey
    )
    console.log(`${new Date().toISOString()}: isVerified `, isVerified)

    // if(handshakeResponse.response) {
    //     const isVerified = SignatureVerifier.verify(
    //         message,
    //         // signature, 512 bit
    //         signatureBuffer,
    //         // public key 256 bit
    //         publicKey
    //     )
    //     // const isVerified = SignatureVerifier.verify(
    //     //     message,
    //     //     handshakeResponse.response.signature.value.asBuffer(),
    //     //     handshakeResponse.response.account.publicKey
    //     // )
    //     console.log(`${new Date().toISOString()}: isVerified `, isVerified)
    // }
}
