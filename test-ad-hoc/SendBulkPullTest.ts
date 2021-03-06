import {KeyPair, LedgerConstants} from '../src/secure/Common'
import Account from '../src/lib/Account'
import NanoSocketClient from '../src/node/NanoProtocol/NanoSocketClient'
import UInt256 from '../src/lib/UInt256'
import {
    BulkPullMessage, FrontierReqMessage,
    MessageHeader,
    MessageType,
    NodeIDHandshakeMessage,
    NodeIDHandshakeMessageResponse
} from '../src/node/Common'
import MessageSigner from '../src/lib/MessageSigner'
import {logToFile} from '../src/debugging'
import {SignatureChecker} from '../src/node/Signatures'
import UInt16 from '../src/lib/UInt16'
import BlockHash from '../src/lib/BlockHash'
import UInt32 from '../src/lib/UInt32'
import Ledger from '../src/secure/Ledger'
import * as fs from 'fs'
import {PassThrough} from 'stream'


function testBulkPull() {
    console.log(`starting testBulkPull, `, process.env.TEST_NANO_NODE_IP)

    const randomKeyPair = KeyPair.createRandomKeyPair()
    const account = new Account(randomKeyPair.publicKey.value)
    console.log(`created randomKeyPair with nano address: ${account.toNANOAddress()}`)

    const client = new NanoSocketClient({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect() {
            const query = new UInt256()
            const handshakeMessage = NodeIDHandshakeMessage.fromQuery(query)
            client.sendMessage(handshakeMessage)
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

                    if(isSignatureVerified) {
                        console.log(`${new Date().toISOString()}: sending createFrontierReqMessage soon`)
                        setTimeout(() => {
                        console.log(`${new Date().toISOString()}: sending createFrontierReqMessage`)
                            client.sendMessage(createFrontierReqMessage())
                        }, 2000)
                    } else {
                        throw 'isSignatureVerified was false'
                    }

                    // handshakeMessage.asBuffer().then(data => {logToFile(data, `handshakeMessage`)})
                    // logToFile(handshakeMessage.query?.asBuffer() || '', `query`)
                    // logToFile(handshakeMessage.response?.account.publicKey.asBuffer() || '', `handshakeMessage.response.account`)
                    // logToFile(handshakeMessage.response?.signature.value.asBuffer() || '', `handshakeMessage.response.signature`)
                } else {
                    console.log(`no response`)
                }
            }
        }
    })
}

function createBulkPullMessage(): BulkPullMessage {
    const extensions = new UInt16()
    const bulkPullMessageHeader = new MessageHeader(MessageType.bulk_pull, extensions)
    const start = new Account(new UInt256())
    const end = new BlockHash(new UInt256())
    const bulkPullMessage = new BulkPullMessage(bulkPullMessageHeader, start, end, Buffer.alloc(4))
    return bulkPullMessage
}

function createFrontierReqMessage() {
    const extensions = new UInt16()
    const messageHeader = new MessageHeader(MessageType.frontier_req, extensions)
    const start = LedgerConstants.nanoLiveGenesisAccount
    const age = new UInt32({octetArray: [0xee, 0, 0, 0x10]})
    const count = new UInt32({octetArray: [0, 0, 0, 0x10]})

    const frontierReqMessage = new FrontierReqMessage(messageHeader, start, age, count)
    return frontierReqMessage
}

function testParseFrontierResponse() {
    // const fileBuffer = fs.readFileSync(`/Users/peterryszkiewicz/Repos/nanocurrency-node/logs/2021-01-03T00-40-56.884Z.MessageParser.log`)
    // const passthrough = new PassThrough()
    // passthrough.write(fileBuffer)
    //
    // console.log()
}

testBulkPull()

