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
var Common_1 = require("../secure/Common");
var UInt8_1 = require("../lib/UInt8");
var UInt16_1 = require("../lib/UInt16");
var UInt256_1 = require("../lib/UInt256");
var Account_1 = require("../lib/Account");
var UInt512_1 = require("../lib/UInt512");
var Numbers_1 = require("../lib/Numbers");
var IPAddress = /** @class */ (function () {
    function IPAddress(ipValue) {
        this.value = ipValue;
    }
    return IPAddress;
}());
exports.IPAddress = IPAddress;
var UDPEndpoint = /** @class */ (function () {
    function UDPEndpoint(address, port) {
        this.address = address;
        this.port = port;
    }
    UDPEndpoint.prototype.getAddress = function () {
        return this.address;
    };
    UDPEndpoint.prototype.getPort = function () {
        return this.port;
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
        this.versionMax = versionMax || Constants.protocolVersion;
        this.versionUsing = versionUsing || Constants.protocolVersion;
        this.versionMin = versionMin || Constants.protocolVersionMin;
        this.messageType = messageType;
        this.extensions = extensions;
    }
    MessageHeader.prototype.serialize = function (writableStream) {
        writableStream.write(Common_1.NetworkParams.headerMagicNumber.asBuffer());
        writableStream.write(this.versionMax.asBuffer());
        writableStream.write(this.versionUsing.asBuffer());
        writableStream.write(this.versionMin.asBuffer());
        writableStream.write(Buffer.from([this.messageType]));
        writableStream.write(this.extensions.asBuffer());
    };
    MessageHeader.from = function (readableStream, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var messageStream;
            return __generator(this, function (_a) {
                messageStream = new ReadableMessageStream(readableStream);
                return [2 /*return*/, MessageDecoder.readMessageHeaderFromStream(messageStream, timeout)];
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
        this.messageHeader = new MessageHeader(MessageType.keepalive); // FIXME
        this.peers = peers;
    }
    KeepaliveMessage.prototype.serialize = function (stream) {
        //TODO
    };
    KeepaliveMessage.prototype.visit = function (messageVisitor) {
        //TODO
    };
    KeepaliveMessage.prototype.getPeers = function () {
        return this.peers;
    };
    KeepaliveMessage.prototype.getMessageHeader = function () {
        return this.messageHeader;
    };
    return KeepaliveMessage;
}());
exports.KeepaliveMessage = KeepaliveMessage;
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
var NodeIDHandshakeMessage = /** @class */ (function () {
    function NodeIDHandshakeMessage(messageHeader, query, response) {
        this.messageHeader = messageHeader;
        this.query = query;
        this.response = response;
    }
    NodeIDHandshakeMessage.fromQuery = function (query) {
        var extensionsUInt = 1 << MessageHeader.nodeIDHandshakeQueryFlagPosition;
        var extensionsBuffer = Buffer.alloc(2);
        extensionsBuffer.writeUInt16BE(extensionsUInt, 0);
        var extensions = new UInt16_1.default({ buffer: extensionsBuffer });
        var messageHeader = new MessageHeader(MessageType.node_id_handshake, extensions);
        return new NodeIDHandshakeMessage(messageHeader, query);
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
    Constants.protocolVersionMin = new UInt8_1.default({ octetArray: [0x0d] });
})(Constants || (Constants = {}));
exports.default = Constants;
var MessageDecoder;
(function (MessageDecoder) {
    function readMessageHeaderFromStream(stream, timeoutMS) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var magicNumber, versionMax, versionUsing, versionMin, messageType, extensions, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (timeoutMS) {
                                        setTimeout(function () { return reject(); }, timeoutMS);
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 8, , 9]);
                                    return [4 /*yield*/, stream.readUInt(UInt16_1.default)];
                                case 2:
                                    magicNumber = _a.sent();
                                    if (!magicNumber.equals(Common_1.NetworkParams.headerMagicNumber)) {
                                        return [2 /*return*/, reject(new Error('Invalid magic number'))];
                                    }
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 3:
                                    versionMax = _a.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 4:
                                    versionUsing = _a.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 5:
                                    versionMin = _a.sent();
                                    return [4 /*yield*/, stream.readUInt(UInt8_1.default)];
                                case 6:
                                    messageType = (_a.sent()).asUint8Array()[0] // TODO: validate
                                    ;
                                    return [4 /*yield*/, stream.readUInt(UInt16_1.default)];
                                case 7:
                                    extensions = _a.sent();
                                    resolve(new MessageHeader(messageType, extensions, versionMax, versionUsing, versionMin));
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_2 = _a.sent();
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
//# sourceMappingURL=Common.js.map