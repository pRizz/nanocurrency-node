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
    function MessageHeader(versionMax, versionUsing, versionMin, messageType, extensions) {
        this.versionMax = versionMax;
        this.versionUsing = versionUsing;
        this.versionMin = versionMin;
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
    MessageHeader.from = function (readableStream) {
        // FIXME
        return new MessageHeader(new UInt8_1.default(), new UInt8_1.default(), new UInt8_1.default(), MessageType.bulk_pull, new UInt16_1.default());
    };
    return MessageHeader;
}());
exports.MessageHeader = MessageHeader;
var Stream = /** @class */ (function () {
    function Stream(readableStream) {
        this.readableStream = readableStream;
    }
    Stream.prototype.readUInt8 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.readableStream.once('readable', function () {
                            resolve(new UInt8_1.default({ buffer: _this.readableStream.read(1) }));
                        });
                    })];
            });
        });
    };
    Stream.prototype.readUInt16 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.readableStream.once('readable', function () {
                            var buffer = _this.readableStream.read(2);
                            if (buffer.length !== 2) {
                                return reject(new Error('Unexpected data from stream'));
                            }
                            resolve(new UInt16_1.default({ buffer: buffer }));
                        });
                    })];
            });
        });
    };
    return Stream;
}());
exports.Stream = Stream;
var KeepaliveMessage = /** @class */ (function () {
    function KeepaliveMessage(peers) {
        this.messageHeader = new MessageHeader(MessageType.keepalive);
        this.peers = peers;
    }
    KeepaliveMessage.prototype.serialize = function (stream) {
        //TODO
    };
    KeepaliveMessage.prototype.visit = function (messageVisitor) {
        //TODO
    };
    KeepaliveMessage.prototype.asBuffer = function () {
        return new Buffer(0); // FIXME
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
var NodeIDHandshakeMessage = /** @class */ (function () {
    function NodeIDHandshakeMessage(synCookie) {
    }
    NodeIDHandshakeMessage.prototype.asBuffer = function () {
        return undefined;
    };
    NodeIDHandshakeMessage.prototype.getMessageHeader = function () {
        return undefined;
    };
    NodeIDHandshakeMessage.prototype.serialize = function (stream) {
    };
    NodeIDHandshakeMessage.prototype.visit = function (messageVisitor) {
    };
    return NodeIDHandshakeMessage;
}());
exports.NodeIDHandshakeMessage = NodeIDHandshakeMessage;
var Constants;
(function (Constants) {
    Constants.tcpRealtimeProtocolVersionMin = 0x11;
})(Constants || (Constants = {}));
exports.default = Constants;
var MessageDecoder = /** @class */ (function () {
    function MessageDecoder(stream) {
        this.stream = stream;
    }
    MessageDecoder.prototype.readMessageHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var magicNumber, versionMax, versionUsing, versionMin, messageType, extensions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readMagicNumber()];
                    case 1:
                        magicNumber = _a.sent();
                        if (!magicNumber.equals(Common_1.NetworkParams.headerMagicNumber)) {
                            return [2 /*return*/, Promise.reject(new Error('Invalid magic number'))];
                        }
                        return [4 /*yield*/, this.readUInt8()];
                    case 2:
                        versionMax = _a.sent();
                        return [4 /*yield*/, this.readUInt8()];
                    case 3:
                        versionUsing = _a.sent();
                        return [4 /*yield*/, this.readUInt8()];
                    case 4:
                        versionMin = _a.sent();
                        return [4 /*yield*/, this.readUInt8()];
                    case 5:
                        messageType = (_a.sent()).asUint8Array()[0] // TODO: verify
                        ;
                        return [4 /*yield*/, this.readUInt16()];
                    case 6:
                        extensions = _a.sent();
                        return [2 /*return*/, new MessageHeader(versionMax, versionUsing, versionMin, messageType, extensions)];
                }
            });
        });
    };
    MessageDecoder.prototype.readMagicNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stream.readUInt16()];
            });
        });
    };
    MessageDecoder.prototype.readUInt8 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stream.readUInt8()];
            });
        });
    };
    MessageDecoder.prototype.readUInt16 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stream.readUInt16()];
            });
        });
    };
    return MessageDecoder;
}());
exports.MessageDecoder = MessageDecoder;
//# sourceMappingURL=Common.js.map