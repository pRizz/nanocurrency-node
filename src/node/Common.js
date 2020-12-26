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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferFromSerializable = exports.NodeIDHandshakeMessage = exports.NodeIDHandshakeMessageResponse = exports.ConfirmReqMessage = exports.KeepaliveMessage = exports.ReadableMessageStream = exports.MessageHeader = exports.MessageType = exports.TCPEndpoint = exports.UDPEndpoint = exports.IPAddress = void 0;
var Common_1 = require("../secure/Common");
var UInt8_1 = require("../lib/UInt8");
var UInt16_1 = require("../lib/UInt16");
var UInt256_1 = require("../lib/UInt256");
var Account_1 = require("../lib/Account");
var UInt512_1 = require("../lib/UInt512");
var Numbers_1 = require("../lib/Numbers");
var stream_1 = require("stream");
var ipaddr = require("ipaddr.js");
var ipaddr_js_1 = require("ipaddr.js");
var IPAddress = /** @class */ (function () {
    function IPAddress(ipValue) {
        this.value = ipValue;
    }
    IPAddress.prototype.isUnspecified = function () {
        return this.value.range() === 'unspecified';
    };
    IPAddress.prototype.isReserved = function () {
        return this.value.range() === 'reserved';
    };
    IPAddress.prototype.equals = function (other) {
        return this.value.match(other.value, 128);
    };
    IPAddress.prototype.toString = function () {
        return this.value.toString();
    };
    return IPAddress;
}());
exports.IPAddress = IPAddress;
var UDPEndpoint = /** @class */ (function () {
    function UDPEndpoint(address, port) {
        this.address = address;
        this.port = port;
    }
    UDPEndpoint.fromDB = function (dbBuffer) {
        var ipBytes = dbBuffer.slice(0, 16);
        var portBytes = dbBuffer.slice(16, 18);
        var ipv6 = new ipaddr.IPv6(__spread(ipBytes));
        var port = portBytes.readUInt16BE(0);
        var ipAddress = new IPAddress(ipv6);
        return new UDPEndpoint(ipAddress, port);
    };
    UDPEndpoint.fromDBKeyBuffer = function (keyBuffer) {
        return UDPEndpoint.fromDB(keyBuffer);
    };
    UDPEndpoint.prototype.getAddress = function () {
        return this.address;
    };
    UDPEndpoint.prototype.getPort = function () {
        return this.port;
    };
    UDPEndpoint.prototype.equals = function (other) {
        return this.address.equals(other.getAddress()) && this.port === other.getPort();
    };
    UDPEndpoint.prototype.toDBBuffer = function () {
        var ipBuffer = Buffer.from(this.address.value.toByteArray());
        var portBuffer = Buffer.alloc(2);
        portBuffer.writeUInt16BE(this.port, 0);
        return Buffer.from(__spread(ipBuffer, portBuffer));
    };
    UDPEndpoint.prototype.asTCPEndpoint = function () {
        return new TCPEndpoint(this.address, this.port);
    };
    UDPEndpoint.prototype.getDBSize = function () {
        return 18; // 16 address + 2 port
    };
    UDPEndpoint.prototype.asBuffer = function () {
        return this.toDBBuffer();
    };
    return UDPEndpoint;
}());
exports.UDPEndpoint = UDPEndpoint;
var TCPEndpoint = /** @class */ (function () {
    function TCPEndpoint(address, port) {
        this.address = address;
        this.port = port;
    }
    TCPEndpoint.prototype.getAddress = function () {
        return this.address;
    };
    TCPEndpoint.prototype.getPort = function () {
        return this.port;
    };
    TCPEndpoint.prototype.equals = function (other) {
        return this.address.equals(other.getAddress()) && this.port === other.getPort();
    };
    TCPEndpoint.prototype.toDBBuffer = function () {
        var ipBuffer = Buffer.from(this.address.value.toByteArray());
        var portBuffer = Buffer.alloc(2);
        portBuffer.writeUInt16BE(this.port, 0);
        return Buffer.from(__spread(ipBuffer, portBuffer));
    };
    TCPEndpoint.prototype.asUDPEndpoint = function () {
        return new UDPEndpoint(this.address, this.port);
    };
    TCPEndpoint.prototype.getDBSize = function () {
        return 18; // 16 address + 2 port
    };
    TCPEndpoint.prototype.asBuffer = function () {
        return this.toDBBuffer();
    };
    return TCPEndpoint;
}());
exports.TCPEndpoint = TCPEndpoint;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["invalid"] = 0] = "invalid";
    MessageType[MessageType["not_a_type"] = 1] = "not_a_type";
    MessageType[MessageType["keepalive"] = 2] = "keepalive";
    MessageType[MessageType["publish"] = 3] = "publish";
    MessageType[MessageType["confirm_req"] = 4] = "confirm_req";
    MessageType[MessageType["confirm_ack"] = 5] = "confirm_ack";
    MessageType[MessageType["bulk_pull"] = 6] = "bulk_pull";
    MessageType[MessageType["bulk_push"] = 7] = "bulk_push";
    MessageType[MessageType["frontier_req"] = 8] = "frontier_req";
    /* deleted 0x9 */
    MessageType[MessageType["node_id_handshake"] = 10] = "node_id_handshake";
    MessageType[MessageType["bulk_pull_account"] = 11] = "bulk_pull_account";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageHeader = /** @class */ (function () {
    function MessageHeader(messageType, extensions, versionMax, versionUsing, versionMin) {
        this.messageType = messageType;
        this.extensions = extensions;
        this.versionMax = versionMax || Constants.protocolVersion;
        this.versionUsing = versionUsing || Constants.protocolVersion;
        this.versionMin = versionMin || Constants.protocolVersionMin;
    }
    MessageHeader.prototype.serialize = function (writableStream) {
        writableStream.write(Common_1.NetworkParams.getHeaderMagicNumber().asBuffer());
        writableStream.write(this.versionMax.asBuffer());
        writableStream.write(this.versionUsing.asBuffer());
        writableStream.write(this.versionMin.asBuffer());
        writableStream.write(Buffer.from([this.messageType]));
        writableStream.write(this.extensionsAsBuffer());
    };
    MessageHeader.fromStream = function (readableStream, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var messageStream;
            return __generator(this, function (_a) {
                messageStream = new ReadableMessageStream(readableStream);
                return [2 /*return*/, MessageDecoder.readMessageHeaderFromStream(messageStream, timeout)];
            });
        });
    };
    MessageHeader.fromBuffer = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var readableStream;
            return __generator(this, function (_a) {
                readableStream = new stream_1.PassThrough();
                readableStream.write(buffer);
                return [2 /*return*/, this.fromStream(readableStream)];
            });
        });
    };
    MessageHeader.prototype.nodeIDHandshakeIsQuery = function () {
        if (this.messageType !== MessageType.node_id_handshake) {
            return false;
        }
        return this.hasFlag(MessageHeader.nodeIDHandshakeQueryFlagPosition);
    };
    MessageHeader.prototype.nodeIDHandshakeIsResponse = function () {
        if (this.messageType !== MessageType.node_id_handshake) {
            return false;
        }
        return this.hasFlag(MessageHeader.nodeIDHandshakeResponseFlagPosition);
    };
    MessageHeader.prototype.hasFlag = function (flagPosition) {
        return (this.extensions.asBuffer().readUInt16BE(0) & (1 << flagPosition)) !== 0;
    };
    MessageHeader.prototype.extensionsAsBuffer = function () {
        return Buffer.from(this.extensions.asBuffer()).swap16();
    };
    MessageHeader.messageHeaderByteCount = 2 + 1 + 1 + 1 + 1 + 2; // magic header + max version + using version + min version + message type + extensions
    MessageHeader.nodeIDHandshakeQueryFlagPosition = 0;
    MessageHeader.nodeIDHandshakeResponseFlagPosition = 1;
    return MessageHeader;
}());
exports.MessageHeader = MessageHeader;
var ReadableMessageStream = /** @class */ (function () {
    function ReadableMessageStream(readableStream) {
        this.readableStream = readableStream;
    }
    ReadableMessageStream.prototype.readUInt = function (uintType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.readableStream.once('readable', function () {
                            var buffer = _this.readableStream.read(uintType.getByteCount());
                            if (buffer === null) {
                                return resolve(_this.readUInt(uintType));
                            }
                            if (buffer.length !== uintType.getByteCount()) {
                                return reject(new Error('Unexpected data from stream'));
                            }
                            resolve(new uintType({ buffer: buffer }));
                        });
                        _this.readableStream.once('end', function () {
                            reject(new Error('Stream unexpectedly ended'));
                        });
                        _this.readableStream.once('error', function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    return ReadableMessageStream;
}());
exports.ReadableMessageStream = ReadableMessageStream;
var KeepaliveMessage = /** @class */ (function () {
    function KeepaliveMessage(peers) {
        this.messageHeader = new MessageHeader(MessageType.keepalive, new UInt16_1.default());
        this.peers = new Set(Array.from({ length: 8 }).map(function () {
            return new UDPEndpoint(new IPAddress(ipaddr_js_1.IPv6.parse("::")), 7075);
        }));
    }
    KeepaliveMessage.prototype.serialize = function (stream) {
        var e_1, _a;
        this.messageHeader.serialize(stream);
        try {
            for (var _b = __values(this.peers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var peer = _c.value;
                stream.write(Buffer.from(peer.address.value.toByteArray()));
                var portBuffer = Buffer.alloc(2);
                portBuffer.writeUInt16BE(peer.port, 0);
                stream.write(portBuffer);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    KeepaliveMessage.prototype.visit = function (messageVisitor) {
        throw 0; // FIXME
    };
    KeepaliveMessage.prototype.getPeers = function () {
        return this.peers;
    };
    KeepaliveMessage.prototype.getMessageHeader = function () {
        return this.messageHeader;
    };
    KeepaliveMessage.prototype.asBuffer = function () {
        throw 0; // FIXME
    };
    return KeepaliveMessage;
}());
exports.KeepaliveMessage = KeepaliveMessage;
var ConfirmReqMessage = /** @class */ (function () {
    function ConfirmReqMessage(block) {
        this.block = block;
    }
    // TODO
    ConfirmReqMessage.prototype.asBuffer = function () {
        throw 0; // FIXME
    };
    ConfirmReqMessage.prototype.getMessageHeader = function () {
        // FIXME
        throw 0; // FIXME
        // return new MessageHeader(MessageType.confirm_req, new UInt16())
    };
    ConfirmReqMessage.prototype.serialize = function (stream) {
        throw 0; // FIXME
    };
    ConfirmReqMessage.prototype.visit = function (messageVisitor) {
        throw 0; // FIXME
    };
    return ConfirmReqMessage;
}());
exports.ConfirmReqMessage = ConfirmReqMessage;
var NodeIDHandshakeMessageResponse = /** @class */ (function () {
    function NodeIDHandshakeMessageResponse(account, signature) {
        this.account = account;
        this.signature = signature;
    }
    NodeIDHandshakeMessageResponse.prototype.serialize = function (stream) {
        stream.write(this.account.publicKey.asBuffer());
        stream.write(this.signature.value.asBuffer());
    };
    return NodeIDHandshakeMessageResponse;
}());
exports.NodeIDHandshakeMessageResponse = NodeIDHandshakeMessageResponse;
var NodeIDHandshakeMessage = /** @class */ (function () {
    function NodeIDHandshakeMessage(messageHeader, query, response) {
        this.messageHeader = messageHeader;
        this.query = query;
        this.response = response;
    }
    NodeIDHandshakeMessage.fromCookie = function (cookie) {
        return this.fromQuery(cookie.value);
    };
    NodeIDHandshakeMessage.fromQuery = function (query) {
        var extensionsUInt = 1 << MessageHeader.nodeIDHandshakeQueryFlagPosition;
        var extensionsBuffer = Buffer.alloc(2);
        extensionsBuffer.writeUInt16BE(extensionsUInt, 0);
        var extensions = new UInt16_1.default({ buffer: extensionsBuffer });
        var messageHeader = new MessageHeader(MessageType.node_id_handshake, extensions);
        return new NodeIDHandshakeMessage(messageHeader, query);
    };
    NodeIDHandshakeMessage.fromResponse = function (response) {
        var extensionsUInt = 1 << MessageHeader.nodeIDHandshakeResponseFlagPosition;
        var extensionsBuffer = Buffer.alloc(2);
        extensionsBuffer.writeUInt16BE(extensionsUInt, 0);
        var extensions = new UInt16_1.default({ buffer: extensionsBuffer });
        var messageHeader = new MessageHeader(MessageType.node_id_handshake, extensions);
        return new NodeIDHandshakeMessage(messageHeader, undefined, response);
    };
    NodeIDHandshakeMessage.prototype.getMessageHeader = function () {
        return this.messageHeader;
    };
    NodeIDHandshakeMessage.prototype.serialize = function (stream) {
        this.messageHeader.serialize(stream);
        if (this.query) {
            stream.write(this.query.asBuffer());
        }
        if (this.response) {
            this.response.serialize(stream);
        }
    };
    NodeIDHandshakeMessage.prototype.asBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bufferFromSerializable(this)];
            });
        });
    };
    NodeIDHandshakeMessage.prototype.visit = function (messageVisitor) {
    };
    NodeIDHandshakeMessage.from = function (header, stream, timeoutMS) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (header.messageType !== MessageType.node_id_handshake) {
                    return [2 /*return*/, Promise.reject(new Error("Unexpected message header"))];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var query, messageResponse, account, _a, signature, _b, error_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (timeoutMS) {
                                        setTimeout(function () { return reject(new Error("Timeout while attempting to read NodeIDHandshakeMessage")); }, timeoutMS);
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 7, , 8]);
                                    query = void 0;
                                    if (!header.nodeIDHandshakeIsQuery()) return [3 /*break*/, 3];
                                    return [4 /*yield*/, stream.readUInt(UInt256_1.default)];
                                case 2:
                                    query = _c.sent();
                                    _c.label = 3;
                                case 3:
                                    messageResponse = void 0;
                                    if (!header.nodeIDHandshakeIsResponse()) return [3 /*break*/, 6];
                                    _a = Account_1.default.bind;
                                    return [4 /*yield*/, stream.readUInt(UInt256_1.default)];
                                case 4:
                                    account = new (_a.apply(Account_1.default, [void 0, _c.sent()]))();
                                    _b = Numbers_1.Signature.bind;
                                    return [4 /*yield*/, stream.readUInt(UInt512_1.default)];
                                case 5:
                                    signature = new (_b.apply(Numbers_1.Signature, [void 0, _c.sent()]))();
                                    messageResponse = new NodeIDHandshakeMessageResponse(account, signature);
                                    _c.label = 6;
                                case 6:
                                    resolve(new NodeIDHandshakeMessage(header, query, messageResponse));
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_1 = _c.sent();
                                    reject(error_1);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return NodeIDHandshakeMessage;
}());
exports.NodeIDHandshakeMessage = NodeIDHandshakeMessage;
var Constants;
(function (Constants) {
    Constants.tcpRealtimeProtocolVersionMin = 0x11;
    Constants.protocolVersion = new UInt8_1.default({ octetArray: [0x11] });
    Constants.protocolVersionMin = new UInt8_1.default({ octetArray: [0x10] });
    Constants.blockProcessorBatchSize = 10000; // FIXME
    function getVersion() {
        return '1.0.0'; // FIXME
    }
    Constants.getVersion = getVersion;
})(Constants || (Constants = {}));
exports.default = Constants;
var MessageDecoder;
(function (MessageDecoder) {
    function readMessageHeaderFromStream(stream, timeoutMS) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var magicNumber, versionMax, versionUsing, versionMin, messageType, extensions, _a, error_2;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (timeoutMS) {
                                        setTimeout(function () { return reject(); }, timeoutMS);
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 8, , 9]);
                                    return [4 /*yield*/, stream.readUInt(UInt16_1.default)];
                                case 2:
                                    magicNumber = _c.sent();
                                    if (!magicNumber.equals(Common_1.NetworkParams.getHeaderMagicNumber())) {
                                        return [2 /*return*/, reject(new Error('Invalid magic number'))];
                                    }
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 3:
                                    versionMax = _c.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 4:
                                    versionUsing = _c.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 5:
                                    versionMin = _c.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 6:
                                    messageType = (_c.sent()).asUint8Array()[0] // TODO: validate
                                    ;
                                    _a = UInt16_1.default.bind;
                                    _b = {};
                                    return [4 /*yield*/, stream.readUInt(UInt16_1.default)];
                                case 7:
                                    extensions = new (_a.apply(UInt16_1.default, [void 0, (_b.buffer = (_c.sent()).asBuffer().swap16(), _b)]))();
                                    resolve(new MessageHeader(messageType, extensions, versionMax, versionUsing, versionMin));
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_2 = _c.sent();
                                    reject(error_2);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    }
    MessageDecoder.readMessageHeaderFromStream = readMessageHeaderFromStream;
})(MessageDecoder || (MessageDecoder = {}));
function bufferFromSerializable(serializable) {
    return __awaiter(this, void 0, void 0, function () {
        var passThroughStream;
        return __generator(this, function (_a) {
            passThroughStream = new stream_1.PassThrough();
            serializable.serialize(passThroughStream);
            passThroughStream.end();
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var messageBuffer = Buffer.alloc(0);
                    passThroughStream.on('readable', function () {
                        var buffer;
                        while (buffer = passThroughStream.read()) {
                            messageBuffer = Buffer.concat([messageBuffer, buffer]);
                        }
                    });
                    passThroughStream.once('end', function () {
                        resolve(messageBuffer);
                    });
                    passThroughStream.once('error', function (error) {
                        reject(error);
                    });
                })];
        });
    });
}
exports.bufferFromSerializable = bufferFromSerializable;
//# sourceMappingURL=Common.js.map