"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var Common_1 = require("../src/node/Common");
var UInt256_1 = require("../src/lib/UInt256");
var fs = require("fs");
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
testSendHandshake();
//# sourceMappingURL=SendHandshakeTest.js.map