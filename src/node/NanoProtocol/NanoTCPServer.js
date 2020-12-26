"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoTCPServer2 = exports.runServer = void 0;
// import {Listener} from '../WebSocket'
var net = require("net");
var AbstractTCPServer_1 = require("../../lib/AbstractTCPServer");
var MessageParser_1 = require("../../lib/MessageParser");
// export interface Conn extends Reader, Writer, Closer {
//     localAddr: Addr;
//     remoteAddr: Addr;
//     rid: number;
//     closeRead(): void;
//     closeWrite(): void;
// }
// should use the tcp library, which returns a listener
// interface Listener {
//     accept(): Promise<NanoConnection>
//     close(): void
//     address: Addr
// }
var NanoConnection = /** @class */ (function () {
    function NanoConnection() {
    }
    NanoConnection.prototype.close = function () {
    };
    return NanoConnection;
}());
// inspired by https://github.com/denoland/deno/blob/master/std/http/server.ts
var NanoTCPServer = /** @class */ (function () {
    function NanoTCPServer(nanoTCPServerConfig) {
        var _this = this;
        this.nanoTCPServerConfig = nanoTCPServerConfig;
        // private closing = false
        // private readonly connections: net.Socket[] = []
        this.connectionsAndParsers = [];
        this.tcpServer = net.createServer({});
        this.tcpServer.on('close', function () {
            console.log(new Date().toISOString() + ": NanoTCPServer: got closed event");
        });
        this.tcpServer.on('connection', function (connection) {
            console.log(new Date().toISOString() + ": NanoTCPServer: got connection event");
            _this.connectionHandler(connection);
        });
        this.tcpServer.on('error', function (error) {
            console.error(new Date().toISOString() + ": NanoTCPServer: got error event:", error);
            // FIXME
            if (error.code === 'EADDRINUSE') {
                console.error(new Date().toISOString() + ": NanoTCPServer: address already in use");
                _this.close();
            }
        });
        this.tcpServer.on('listening', function () {
            console.log(new Date().toISOString() + ": NanoTCPServer: got listening event");
        });
        this.tcpServer.listen({
            port: nanoTCPServerConfig.port
        });
    }
    NanoTCPServer.prototype.connectionHandler = function (connection) {
        var messageParser = new MessageParser_1.MessageParser(connection, {
            onHandshake: function (handshakeMessage) {
                console.log(new Date().toISOString() + ": " + connection.remoteAddress + ":" + connection.remotePort + ": onHandshake()");
            },
            onKeepalive: function (keepaliveMessage) {
                console.log(new Date().toISOString() + ": " + connection.remoteAddress + ":" + connection.remotePort + ": onKeepalive()");
            },
        });
        connection.setTimeout(3000, function () {
            console.log(new Date().toISOString() + ": connection on timeout");
        });
        this.connectionsAndParsers.push({ connection: connection, messageParser: messageParser });
    };
    // private closeConnection(connection: net.Socket) {
    //     connection.end()
    // }
    NanoTCPServer.prototype.close = function () {
        console.log(new Date().toISOString() + ": NanoTCPServer: close() called");
        // this.closing = true
        this.tcpServer.close();
        // this.connections.forEach(this.closeConnection)
        this.connectionsAndParsers.map(function (cAP) { return cAP.connection; }).forEach(net.Socket.prototype.end.bind); // TODO: test
        // TODO: unref all sockets?
        this.connectionsAndParsers.splice(0, this.connectionsAndParsers.length);
        this.tcpServer.unref();
    };
    NanoTCPServer.prototype.stop = function () {
        console.log(new Date().toISOString() + ": NanoTCPServer: stop() called");
        this.close();
    };
    return NanoTCPServer;
}());
// inspiration from
// https://github.com/http-kit/http-kit/blob/master/src/org/httpkit/server.clj
// https://github.com/http-kit/http-kit/blob/master/src/java/org/httpkit/server/HttpServer.java
function runServer() {
    var serverConfig = {
        port: 7075,
    };
    var server = new NanoTCPServer(serverConfig);
    return {
        stop: function () {
            server.stop();
            return true;
        }
    };
}
exports.runServer = runServer;
var NanoTCPServer2 = /** @class */ (function () {
    function NanoTCPServer2() {
        this.tcpServer = new AbstractTCPServer_1.AbstractTCPServer({
            port: 5555,
            messageDefinitions: [],
            eventListener: this,
        });
    }
    NanoTCPServer2.prototype.start = function () {
        this.tcpServer.start();
    };
    NanoTCPServer2.prototype.stop = function () {
        this.tcpServer.stop();
    };
    NanoTCPServer2.prototype.onError = function () {
    };
    return NanoTCPServer2;
}());
exports.NanoTCPServer2 = NanoTCPServer2;
//# sourceMappingURL=NanoTCPServer.js.map