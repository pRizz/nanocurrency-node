"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {Listener} from '../WebSocket'
var net = require("net");
var AbstractTCPServer_1 = require("../../lib/AbstractTCPServer");
var Common_1 = require("../Common");
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
        this.connections = [];
        this.tcpServer = net.createServer({});
        this.tcpServer.on('close', function () {
            console.log(new Date().toISOString() + ": NanoTCPServer: got closed event");
        });
        this.tcpServer.on('connection', function (connection) {
            console.log(new Date().toISOString() + ": NanoTCPServer: got connection event");
            _this.connections.push(connection);
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
        var _this = this;
        connection.setTimeout(3000, function () {
            console.log(new Date().toISOString() + ": connection on timeout");
        });
        connection.on('data', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var header;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(new Date().toISOString() + ": connection on data");
                        return [4 /*yield*/, Common_1.MessageHeader.fromBuffer(data)
                            // TODO: check what kind of message this is and parse accordingly
                        ];
                    case 1:
                        header = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // private closeConnection(connection: net.Socket) {
    //     connection.end()
    // }
    NanoTCPServer.prototype.close = function () {
        console.log(new Date().toISOString() + ": NanoTCPServer: close() called");
        // this.closing = true
        this.tcpServer.close();
        // this.connections.forEach(this.closeConnection)
        this.connections.forEach(net.Socket.prototype.end.bind); // TODO: test
        // TODO: unref all sockets?
        this.connections.splice(0, this.connections.length);
        this.tcpServer.unref();
    };
    NanoTCPServer.prototype.stop = function () {
        console.log(new Date().toISOString() + ": NanoTCPServer: stop() called");
        this.close();
    };
    return NanoTCPServer;
}());
// inspiration from https://github.com/http-kit/http-kit/blob/master/src/org/httpkit/server.clj
// https://github.com/http-kit/http-kit/blob/master/src/java/org/httpkit/server/HttpServer.java
function runServer() {
    var server = new NanoTCPServer();
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