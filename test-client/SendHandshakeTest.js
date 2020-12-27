"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var Common_1 = require("../src/node/Common");
var UInt256_1 = require("../src/lib/UInt256");
var fs = require("fs");
var NanoSocketClient_1 = require("../src/node/NanoProtocol/NanoSocketClient");
var Signatures_1 = require("../src/node/Signatures");
var debugging_1 = require("../src/debugging");
var Common_2 = require("../src/secure/Common");
var Account_1 = require("../src/lib/Account");
var MessageSigner_1 = require("../src/lib/MessageSigner");
function testSendHandshake() {
    console.log("starting handshake test");
    var testNanoNodeIP = process.env.TEST_NANO_NODE_IP;
    if (!testNanoNodeIP) {
        throw "no TEST_NANO_NODE_IP found in environment";
    }
    if (!net.isIP(testNanoNodeIP)) {
        throw "the TEST_NANO_NODE_IP found in the environment is not an IP Address; see https://nodejs.org/api/net.html#net_net_isip_input";
    }
    console.log("testing with Node at " + testNanoNodeIP);
    var syncPort = 7075;
    var clientSocket = net.createConnection({
        host: testNanoNodeIP,
        port: syncPort,
        timeout: 10000,
    });
    clientSocket.on('lookup', function (err, address, family, host) {
        console.log(new Date().toISOString() + ": clientSocket.on('lookup'): " + { err: err, address: address, family: family, host: host });
    });
    clientSocket.on('connect', function () {
        console.log(new Date().toISOString() + ": clientSocket.on('connect')");
        var query = new UInt256_1.default();
        var handshakeMessage = Common_1.NodeIDHandshakeMessage.fromQuery(query);
        // clientSocket.write(handshakeMessage.asBuffer())
        // or
        handshakeMessage.serialize(clientSocket);
    });
    clientSocket.on('data', function (data) {
        console.log(new Date().toISOString() + ": clientSocket.on('data'), " + data.length + ", " + data);
        fs.writeFile(new Date().toISOString() + ".SendHandshakeTest.bin", data, function (err) {
            if (err)
                throw err;
            console.log('The response binary has been saved to a file!');
        });
    });
    clientSocket.on('close', function (had_error) {
        console.log(new Date().toISOString() + ": clientSocket.on('close'): had_error: " + had_error);
    });
    clientSocket.on('error', function (err) {
        console.log(new Date().toISOString() + ": clientSocket.on('error'): err: " + err);
    });
    clientSocket.on('end', function () {
        console.log(new Date().toISOString() + ": clientSocket.on('end')");
    });
    clientSocket.on('timeout', function () {
        console.log(new Date().toISOString() + ": clientSocket.on('timeout')");
    });
}
function testSendHandshakeWithClient() {
    console.log("starting testSendHandshakeWithClient, ", process.env.TEST_NANO_NODE_IP);
    var randomKeyPair = Common_2.KeyPair.createRandomKeyPair();
    var account = new Account_1.default(randomKeyPair.publicKey.value);
    console.log("created randomKeyPair with nano address: " + account.toNANOAddress());
    var client = new NanoSocketClient_1.default({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect: function () {
            var query = new UInt256_1.default();
            var handshakeMessage = Common_1.NodeIDHandshakeMessage.fromQuery(query);
            handshakeMessage.asBuffer().then(function (buffer) {
                console.log("query buffer:");
                console.log(buffer);
                client.sendMessage(handshakeMessage);
            });
        },
        messageEventListener: {
            onKeepalive: function (keepaliveMessage) {
                console.log(new Date().toISOString() + ": onKeepalive");
                console.log(keepaliveMessage);
            },
            onHandshake: function (handshakeMessage) {
                var _a, _b, _c;
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
                    var signedResponse = new Common_1.NodeIDHandshakeMessageResponse(account, signedQuery);
                    var signedHandshakeMessage = Common_1.NodeIDHandshakeMessage.fromResponse(signedResponse);
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
                    // FIXME: handle verification
                    handshakeMessage.asBuffer().then(function (data) { debugging_1.logToFile(data, "handshakeMessage"); });
                    debugging_1.logToFile(((_a = handshakeMessage.query) === null || _a === void 0 ? void 0 : _a.asBuffer()) || '', "query");
                    debugging_1.logToFile(((_b = handshakeMessage.response) === null || _b === void 0 ? void 0 : _b.account.publicKey.asBuffer()) || '', "handshakeMessage.response.account");
                    debugging_1.logToFile(((_c = handshakeMessage.response) === null || _c === void 0 ? void 0 : _c.signature.value.asBuffer()) || '', "handshakeMessage.response.signature");
                }
                else {
                    console.log("no response");
                }
            }
        }
    });
}
// testSendHandshake()
testSendHandshakeWithClient();
//# sourceMappingURL=SendHandshakeTest.js.map