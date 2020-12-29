"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.testHandshakeRequestAndResponse = exports.testConfirmReq = exports.testHandshake = exports.testSendKeepalive = void 0;
var Common_1 = require("../src/node/Common");
var UInt512_1 = require("../src/lib/UInt512");
var Account_1 = require("../src/lib/Account");
var ipaddr_js_1 = require("ipaddr.js");
var UInt256_1 = require("../src/lib/UInt256");
var Network_1 = require("../src/node/Network");
var stream_1 = require("stream");
var SignatureVerifier_1 = require("../src/lib/SignatureVerifier");
var testNodeIP = "18.218.157.99";
var livePeerNetworkDomain = "peering.nano.org";
var livePeerNetworkIP = "139.180.168.194";
var activeIP = testNodeIP;
var testNodePort = 7075;
var net = require('net');
var preconfiguredRepPublicKeys = [
    "A30E0A32ED41C8607AA9212843392E853FCBCB4E7CB194E35C94F07F91DE59EF",
    "67556D31DDFC2A440BF6147501449B4CB9572278D034EE686A6BEE29851681DF",
    "5C2FBB148E006A8E8BA7A75DD86C9FE00C83F5FFDBFD76EAA09531071436B6AF",
    "AE7AC63990DAAAF2A69BF11C913B928844BF5012355456F2F164166464024B29",
    "BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA",
    "2399A083C600AA0572F5E36247D978FCFC840405F8D4B6D33161C0066A55F431",
    "2298FAB7C61058E77EA554CB93EDEEDA0692CBFCC540AB213B2836B29029E23A",
    "3FE80B4BC842E82C1C18ABFEEC47EA989E63953BC82AC411F304D13833D52A56",
];
var testRepPublicKey = "BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA";
function getRandomBlock() {
    // return new Block
}
var FakeTCPChannelsDelegate = /** @class */ (function () {
    function FakeTCPChannelsDelegate() {
    }
    FakeTCPChannelsDelegate.prototype.bootstrapPeer = function (protocolVersionMin) {
        return new Common_1.TCPEndpoint(new Common_1.IPAddress(ipaddr_js_1.IPv6.parse("::1")), testNodePort);
    };
    FakeTCPChannelsDelegate.prototype.getAccountCookieForEndpoint = function (endpoint) {
        return new Account_1.default(new UInt256_1.default());
    };
    FakeTCPChannelsDelegate.prototype.getNodeID = function () {
        return new Account_1.default(new UInt256_1.default());
    };
    FakeTCPChannelsDelegate.prototype.getPrivateKey = function () {
        return new UInt512_1.default();
    };
    FakeTCPChannelsDelegate.prototype.getRandomPeers = function () {
        return new Set();
    };
    FakeTCPChannelsDelegate.prototype.getUDPChannelCount = function () {
        return 0;
    };
    FakeTCPChannelsDelegate.prototype.hasNode = function (nodeID) {
        return false;
    };
    FakeTCPChannelsDelegate.prototype.hasPeer = function (endpoint, allowLocalPeers) {
        return false;
    };
    FakeTCPChannelsDelegate.prototype.isLocalPeersAllowed = function () {
        return false;
    };
    FakeTCPChannelsDelegate.prototype.isNodeValid = function (endpoint, nodeID, signature) {
        return false;
    };
    FakeTCPChannelsDelegate.prototype.startTCPReceiveNodeID = function (channel, endpoint, receiveBuffer, callback) {
        console.log(new Date().toISOString() + ": in startTCPReceiveNodeID: channel: ", channel, endpoint);
        callback();
    };
    FakeTCPChannelsDelegate.prototype.tcpSocketConnectionFailed = function () {
        console.log(new Date().toISOString() + ": in tcpSocketConnectionFailed: channel: ");
    };
    return FakeTCPChannelsDelegate;
}());
function generateRandomBlock() {
    return UInt256_1.default.getRandom();
}
function createHandshakeMessage() {
    var query = generateRandomBlock();
    var cookie = new Network_1.SYNCookie(query);
    return Common_1.NodeIDHandshakeMessage.fromCookie(cookie);
}
function testSendKeepalive() {
    var _this = this;
    testHandshakeRequestAndResponse().then();
    return;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var handshakeMessage, keepaliveMessage, keepaliveMessageBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handshakeMessage = createHandshakeMessage();
                    keepaliveMessage = new Common_1.KeepaliveMessage(new Set());
                    return [4 /*yield*/, Common_1.bufferFromSerializable(keepaliveMessage)
                        // console.log(`${new Date().toISOString()}: send keepaliveMessage.getPeers().size `, keepaliveMessage.getPeers().size)
                    ];
                case 1:
                    keepaliveMessageBuffer = _a.sent();
                    // console.log(`${new Date().toISOString()}: send keepaliveMessage.getPeers().size `, keepaliveMessage.getPeers().size)
                    console.log(new Date().toISOString() + ": send keepaliveMessageBuffer.length ", keepaliveMessageBuffer.length);
                    console.log(new Date().toISOString() + ": send keepaliveMessageBuffer ", keepaliveMessageBuffer);
                    return [2 /*return*/];
            }
        });
    }); })();
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
    var nodeServer = net.createServer(function (socket) {
        console.log(new Date().toISOString() + ": server new connection ");
        socket.on('data', function (data) {
            console.log(new Date().toISOString() + ": server client got data ", data);
        });
        socket.on('end', function () {
            console.log(new Date().toISOString() + ": server client end ");
        });
    });
    nodeServer.on('error', function (error) {
        console.log(new Date().toISOString() + ": server error ", error);
    });
    nodeServer.on('close', function () {
        console.log(new Date().toISOString() + ": server close ");
    });
    nodeServer.on('connection', function () {
        console.log(new Date().toISOString() + ": server connection ");
    });
    nodeServer.listen(7075, function () {
        console.log(new Date().toISOString() + ": server listen called ");
    });
    var nodeSocket = net.createConnection({
        host: activeIP,
        port: testNodePort,
        readable: true,
        writable: true,
        timeout: 10000
    }, function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(new Date().toISOString() + ": connected to node! ");
            return [2 /*return*/];
        });
    }); });
    nodeSocket.on('timeout', function () {
        console.log(new Date().toISOString() + ": node on timeout ");
    });
    nodeSocket.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
        var handshakeMessage, handshakeMessageBuffer, keepaliveMessage, keepaliveMessageBuffer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(new Date().toISOString() + ": node on ready ");
                    handshakeMessage = createHandshakeMessage();
                    return [4 /*yield*/, Common_1.bufferFromSerializable(handshakeMessage)];
                case 1:
                    handshakeMessageBuffer = _a.sent();
                    keepaliveMessage = new Common_1.KeepaliveMessage(new Set());
                    return [4 /*yield*/, Common_1.bufferFromSerializable(keepaliveMessage)];
                case 2:
                    keepaliveMessageBuffer = _a.sent();
                    console.log(new Date().toISOString() + ": send keepaliveMessageBuffer.length ", keepaliveMessageBuffer.length);
                    console.log(new Date().toISOString() + ": send keepaliveMessageBuffer ", keepaliveMessageBuffer);
                    console.log(new Date().toISOString() + ": send handshakeMessageBuffer.length ", handshakeMessageBuffer.length);
                    console.log(new Date().toISOString() + ": send handshakeMessageBuffer ", handshakeMessageBuffer.toString('hex'));
                    nodeSocket.write(keepaliveMessageBuffer);
                    nodeSocket.write(handshakeMessageBuffer);
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = nodeSocket).write;
                                    return [4 /*yield*/, Common_1.bufferFromSerializable(keepaliveMessage)];
                                case 1:
                                    _b.apply(_a, [_c.sent()]);
                                    console.log(new Date().toISOString() + ": send keepaliveMessageBuffer ", keepaliveMessageBuffer);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 2500);
                    return [2 /*return*/];
            }
        });
    }); });
    nodeSocket.on('error', function (error) {
        console.log(new Date().toISOString() + ": node on error ", error);
    });
    nodeSocket.on('end', function () {
        console.log(new Date().toISOString() + ": node on end ");
    });
    nodeSocket.on('connect', function () {
        console.log(new Date().toISOString() + ": node on connect    ");
    });
    nodeSocket.on('data', function (data) {
        console.log(new Date().toISOString() + ": node on data ", data);
        console.log(new Date().toISOString() + ": node on data ", data.toString('hex'));
    });
    nodeSocket.on('drain', function () {
        console.log(new Date().toISOString() + ": node on drain ");
    });
    nodeSocket.on('close', function (hadError) {
        console.log(new Date().toISOString() + ": node on close ", hadError);
    });
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
    console.log(new Date().toISOString() + ": done with test ");
}
exports.testSendKeepalive = testSendKeepalive;
function testHandshake() {
}
exports.testHandshake = testHandshake;
function testConfirmReq() {
    var confirmReqType = 0x4;
    var messageObject = {};
    var block = getRandomBlock();
    var confirmReqMessage = new Common_1.ConfirmReqMessage();
    var nodeConnection = net.createConnection({
        host: testNodeIP,
        port: testNodePort,
        readable: true,
        writable: true,
        timeout: 10000
    }, function () {
    });
    setTimeout(function () {
        // nodeConnection.write()
    }, 15000);
}
exports.testConfirmReq = testConfirmReq;
function readableStreamFromBuffer(buffer) {
    // const buffer = new Buffer(img_string, 'base64')
    var readable = new stream_1.Readable();
    readable._read = function () { }; // _read is required but you can noop it
    readable.push(buffer);
    readable.push(null);
    return readable;
    // readable.pipe(consumer) // consume the stream
}
function testHandshakeRequestAndResponse() {
    return __awaiter(this, void 0, void 0, function () {
        var message, signatureBuffer, publicKey, isVerified;
        return __generator(this, function (_a) {
            message = Buffer.from('434efc904f311a1d9bc4f9b5c2172d447d1611de7b94d2875ff19e8f1157db52', 'hex');
            signatureBuffer = Buffer.from('7e95f882b05fb667ce63c65553683acecbeb6623b2719e23a14fcff1e185617d4ffb180a2af4c979d79648a81f8c3b652efc97d58a0f261d0686f6640d3f880a', 'hex');
            publicKey = new UInt256_1.default({ buffer: Buffer.from('2f72e664d5efcf74227ab9638a66705a347b87bc4a6bbc6e77fd2a5c1775e3c7', 'hex') });
            isVerified = SignatureVerifier_1.default.verify(message, 
            // signature, 512 bit
            signatureBuffer, 
            // public key 256 bit
            publicKey);
            console.log(new Date().toISOString() + ": isVerified ", isVerified);
            return [2 /*return*/];
        });
    });
}
exports.testHandshakeRequestAndResponse = testHandshakeRequestAndResponse;
//# sourceMappingURL=TestApi.js.map