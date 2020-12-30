"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var MessageParser_1 = require("../../lib/MessageParser");
var NanoSocketClient = /** @class */ (function () {
    function NanoSocketClient(nanoSocketClientConfig) {
        // TODO: check if remoteHost is an ip or hostname
        this.nanoSocketClientConfig = nanoSocketClientConfig;
        var syncPort = nanoSocketClientConfig.remotePort || 7075;
        this.clientSocket = net.createConnection({
            host: nanoSocketClientConfig.remoteHost,
            port: syncPort,
            timeout: 10000,
        });
        this.messageParser = new MessageParser_1.MessageParser(this.clientSocket, nanoSocketClientConfig.messageEventListener);
        this.clientSocket.on('lookup', function (err, address, family, host) {
            console.log(new Date().toISOString() + ": clientSocket.on('lookup'): " + { err: err, address: address, family: family, host: host });
        });
        this.clientSocket.on('connect', function () {
            console.log(new Date().toISOString() + ": clientSocket.on('connect')");
            nanoSocketClientConfig.onConnect();
        });
        this.clientSocket.on('data', function (data) {
            console.log(new Date().toISOString() + ": clientSocket.on('data'), " + data.length + ", " + data);
        });
        this.clientSocket.on('close', function (had_error) {
            console.log(new Date().toISOString() + ": clientSocket.on('close'): had_error: " + had_error);
        });
        this.clientSocket.on('error', function (err) {
            console.log(new Date().toISOString() + ": clientSocket.on('error'): err: " + err);
        });
        this.clientSocket.on('end', function () {
            console.log(new Date().toISOString() + ": clientSocket.on('end')");
        });
        this.clientSocket.on('timeout', function () {
            console.log(new Date().toISOString() + ": clientSocket.on('timeout')");
        });
    }
    NanoSocketClient.prototype.sendMessage = function (message) {
        console.log(new Date().toISOString() + ": clientSocket.sendMessage()", typeof message);
        message.serialize(this.clientSocket);
    };
    return NanoSocketClient;
}());
exports.default = NanoSocketClient;
//# sourceMappingURL=NanoSocketClient.js.map