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
exports.MessageParser = void 0;
var Common_1 = require("../node/Common");
var stream_1 = require("stream");
var debugging_1 = require("../debugging");
// It is the caller's responsibility to use a stream in the valid state. For example, if the stream closes or
// receives an error, the caller must properly handle this, remove the message parser, and make a
// new one on a new connection/stream.
var MessageParser = /** @class */ (function () {
    function MessageParser(stream, messageEventListener) {
        var _this = this;
        this.messageEventListener = messageEventListener;
        stream.on('data', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var header, _a, messageBuffer, messageStream, readableMessageStream, handshakeMessage, e_1;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log(new Date().toISOString() + ": connection on data");
                        debugging_1.logToFile(data);
                        return [4 /*yield*/, Common_1.MessageHeader.fromBuffer(data)];
                    case 1:
                        header = _f.sent();
                        console.log(new Date().toISOString() + ": parsed MessageHeader: " + header);
                        console.log("" + header);
                        _a = header.messageType;
                        switch (_a) {
                            case Common_1.MessageType.invalid: return [3 /*break*/, 2];
                            case Common_1.MessageType.not_a_type: return [3 /*break*/, 3];
                            case Common_1.MessageType.keepalive: return [3 /*break*/, 4];
                            case Common_1.MessageType.publish: return [3 /*break*/, 5];
                            case Common_1.MessageType.confirm_req: return [3 /*break*/, 6];
                            case Common_1.MessageType.confirm_ack: return [3 /*break*/, 7];
                            case Common_1.MessageType.bulk_pull: return [3 /*break*/, 8];
                            case Common_1.MessageType.bulk_push: return [3 /*break*/, 9];
                            case Common_1.MessageType.frontier_req: return [3 /*break*/, 10];
                            case Common_1.MessageType.node_id_handshake: return [3 /*break*/, 11];
                            case Common_1.MessageType.bulk_pull_account: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 17];
                    case 2:
                        console.log(new Date().toISOString() + ": MessageType.invalid");
                        return [3 /*break*/, 17];
                    case 3:
                        console.log(new Date().toISOString() + ": MessageType.not_a_type");
                        return [3 /*break*/, 17];
                    case 4:
                        console.log(new Date().toISOString() + ": MessageType.keepalive");
                        return [3 /*break*/, 17];
                    case 5:
                        console.log(new Date().toISOString() + ": MessageType.publish");
                        return [3 /*break*/, 17];
                    case 6:
                        console.log(new Date().toISOString() + ": MessageType.confirm_req");
                        return [3 /*break*/, 17];
                    case 7:
                        console.log(new Date().toISOString() + ": MessageType.confirm_ack");
                        return [3 /*break*/, 17];
                    case 8:
                        console.log(new Date().toISOString() + ": MessageType.bulk_pull");
                        return [3 /*break*/, 17];
                    case 9:
                        console.log(new Date().toISOString() + ": MessageType.bulk_push");
                        return [3 /*break*/, 17];
                    case 10:
                        console.log(new Date().toISOString() + ": MessageType.frontier_req");
                        return [3 /*break*/, 17];
                    case 11:
                        console.log(new Date().toISOString() + ": MessageType.node_id_handshake");
                        _f.label = 12;
                    case 12:
                        _f.trys.push([12, 14, , 15]);
                        messageBuffer = data.slice(8);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(messageBuffer);
                        debugging_1.logToFile(messageBuffer);
                        readableMessageStream = new Common_1.ReadableMessageStream(messageStream);
                        return [4 /*yield*/, Common_1.NodeIDHandshakeMessage.from(header, readableMessageStream)];
                    case 13:
                        handshakeMessage = _f.sent();
                        console.log(handshakeMessage);
                        console.log(handshakeMessage.response);
                        console.log((_b = handshakeMessage.response) === null || _b === void 0 ? void 0 : _b.account);
                        console.log((_c = handshakeMessage.response) === null || _c === void 0 ? void 0 : _c.account.toNANOAddress());
                        console.log((_d = handshakeMessage.response) === null || _d === void 0 ? void 0 : _d.signature);
                        console.log((_e = handshakeMessage.response) === null || _e === void 0 ? void 0 : _e.signature.value.asBuffer().toString('hex'));
                        messageEventListener.onHandshake(handshakeMessage);
                        return [3 /*break*/, 15];
                    case 14:
                        e_1 = _f.sent();
                        console.log(new Date().toISOString() + ": error while parsing node_id_handshake");
                        return [3 /*break*/, 15];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        console.log(new Date().toISOString() + ": MessageType.bulk_pull_account");
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        }); });
    }
    return MessageParser;
}());
exports.MessageParser = MessageParser;
//# sourceMappingURL=MessageParser.js.map