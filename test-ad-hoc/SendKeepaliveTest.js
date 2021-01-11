"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("../src/secure/Common");
var Account_1 = require("../src/lib/Account");
var NanoSocketClient_1 = require("../src/node/NanoProtocol/NanoSocketClient");
var Common_2 = require("../src/node/Common");
var ipaddr_js_1 = require("ipaddr.js");
function testSendKeepalive() {
    console.log("starting testSendKeepalive, ", process.env.TEST_NANO_NODE_IP);
    var randomKeyPair = Common_1.KeyPair.createRandomKeyPair();
    var account = new Account_1.default(randomKeyPair.publicKey.value);
    console.log("created randomKeyPair with nano address: " + account.toNANOAddress());
    var nanoSocketClient = new NanoSocketClient_1.default({
        remoteHost: process.env.TEST_NANO_NODE_IP || '',
        onConnect: function () {
            var peers = new Set(Array.from({ length: 8 }).map(function () {
                return new Common_2.TCPEndpoint(new Common_2.IPAddress(ipaddr_js_1.IPv6.parse("::") // unspecified address
                ), 7075);
            }));
            var keepaliveMessage = new Common_2.KeepaliveMessage(peers);
            nanoSocketClient.sendMessage(keepaliveMessage);
            console.log(new Date().toISOString() + ": sent keepalive");
        },
        messageEventListener: {
            onHandshake: function (handshakeMessage) {
                console.log(new Date().toISOString() + ": messageEventListener.onHandshake", handshakeMessage);
            },
            onKeepalive: function (keepaliveMessage) {
                console.log(new Date().toISOString() + ": messageEventListener.onKeepalive", keepaliveMessage);
            }
        }
    });
}
testSendKeepalive();
//# sourceMappingURL=SendKeepaliveTest.js.map