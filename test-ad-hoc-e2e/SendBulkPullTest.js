"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../src/secure/Common");
var Account_1 = require("../src/lib/Account");
var NanoSocketClient_1 = require("../src/node/NanoProtocol/NanoSocketClient");
var UInt256_1 = require("../src/lib/UInt256");
var Common_2 = require("../src/node/Common");
var MessageSigner_1 = require("../src/lib/MessageSigner");
var debugging_1 = require("../src/debugging");
var Signatures_1 = require("../src/node/Signatures");
var UInt16_1 = require("../src/lib/UInt16");
var BlockHash_1 = require("../src/lib/BlockHash");
var UInt32_1 = require("../src/lib/UInt32");
function testBulkPull() {
    console.log("starting testBulkPull, ", process.env.TEST_NANO_NODE_IP);
    var randomKeyPair = Common_1.KeyPair.createRandomKeyPair();
    var account = new Account_1.default(randomKeyPair.publicKey.value);
    console.log("created randomKeyPair with nano address: " + account.toNANOAddress());
    var client = new NanoSocketClient_1.default({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect: function () {
            var query = new UInt256_1.default();
            var handshakeMessage = Common_2.NodeIDHandshakeMessage.fromQuery(query);
            client.sendMessage(handshakeMessage);
        },
        messageEventListener: {
            onKeepalive: function (keepaliveMessage) {
                console.log(new Date().toISOString() + ": onKeepalive");
                console.log(keepaliveMessage);
            },
            onHandshake: function (handshakeMessage) {
                console.log(new Date().toISOString() + ": onHandshake");
                console.log(handshakeMessage);
                if (handshakeMessage.query) {
                    // FIXME: only send query response if either there was no response or there is a verified response
                    // send signed response
                    var signedQuery = MessageSigner_1.default.sign(randomKeyPair.privateKey.value, handshakeMessage.query.asBuffer());
                    debugging_1.logToFile(randomKeyPair.privateKey.value.asBuffer(), "randomKeyPair.privateKey.value");
                    debugging_1.logToFile(account.toNANOAddress(), "account.toNANOAddress");
                    debugging_1.logToFile(handshakeMessage.query.asBuffer(), "handshakeMessage.query");
                    debugging_1.logToFile(signedQuery.value.asBuffer(), "signedQuery");
                    var signedResponse = new Common_2.NodeIDHandshakeMessageResponse(account, signedQuery);
                    var signedHandshakeMessage = Common_2.NodeIDHandshakeMessage.fromResponse(signedResponse);
                    signedHandshakeMessage.asBuffer().then(function (buf) {
                        debugging_1.logToFile(buf, "sent-signedHandshakeMessage");
                    });
                    client.sendMessage(signedHandshakeMessage);
                    console.log(new Date().toISOString() + ": sent signedHandshakeMessage");
                }
                if (handshakeMessage.response) {
                    // FIXME: should use the actual challenge sent which will be a random filled SYNCookie
                    var isSignatureVerified = Signatures_1.SignatureChecker.verifyHandshakeResponse(new UInt256_1.default(), handshakeMessage.response);
                    console.log("isSignatureVerified");
                    console.log(isSignatureVerified);
                    if (isSignatureVerified) {
                        console.log(new Date().toISOString() + ": sending createFrontierReqMessage soon");
                        setTimeout(function () {
                            console.log(new Date().toISOString() + ": sending createFrontierReqMessage");
                            client.sendMessage(createFrontierReqMessage());
                        }, 2000);
                    }
                    else {
                        throw 'isSignatureVerified was false';
                    }
                    // handshakeMessage.asBuffer().then(data => {logToFile(data, `handshakeMessage`)})
                    // logToFile(handshakeMessage.query?.asBuffer() || '', `query`)
                    // logToFile(handshakeMessage.response?.account.publicKey.asBuffer() || '', `handshakeMessage.response.account`)
                    // logToFile(handshakeMessage.response?.signature.value.asBuffer() || '', `handshakeMessage.response.signature`)
                }
                else {
                    console.log("no response");
                }
            }
        }
    });
}
function createBulkPullMessage() {
    var extensions = new UInt16_1.default();
    var bulkPullMessageHeader = new Common_2.MessageHeader(Common_2.MessageType.bulk_pull, extensions);
    var start = new Account_1.default(new UInt256_1.default());
    var end = new BlockHash_1.default(new UInt256_1.default());
    var bulkPullMessage = new Common_2.BulkPullMessage(bulkPullMessageHeader, start, end, Buffer.alloc(4));
    return bulkPullMessage;
}
function createFrontierReqMessage() {
    var extensions = new UInt16_1.default();
    var messageHeader = new Common_2.MessageHeader(Common_2.MessageType.frontier_req, extensions);
    var start = Common_1.LedgerConstants.nanoLiveGenesisAccount;
    var age = new UInt32_1.default({ octetArray: [0xee, 0, 0, 0x10] });
    var count = new UInt32_1.default({ octetArray: [0, 0, 0, 0x10] });
    var frontierReqMessage = new Common_2.FrontierReqMessage(messageHeader, start, age, count);
    return frontierReqMessage;
}
function testParseFrontierResponse() {
    // const fileBuffer = fs.readFileSync(`/Users/peterryszkiewicz/Repos/nanocurrency-node/logs/2021-01-03T00-40-56.884Z.MessageParser.log`)
    // const passthrough = new PassThrough()
    // passthrough.write(fileBuffer)
    //
    // console.log()
}
testBulkPull();
//# sourceMappingURL=SendBulkPullTest.js.map