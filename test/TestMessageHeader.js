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
var assert = require("assert");
var Common_1 = require("../src/node/Common");
var UInt8_1 = require("../src/lib/UInt8");
var UInt16_1 = require("../src/lib/UInt16");
var stream_1 = require("stream");
var Common_2 = require("../src/secure/Common");
var fs = require("fs");
describe('MessageHeader', function () {
    describe('#serialize()', function () {
        it('should serialize the message header to the stream', function () { return __awaiter(void 0, void 0, void 0, function () {
            var messageHeader, actualBuffer, writable, expectedBuffer;
            return __generator(this, function (_a) {
                messageHeader = new Common_1.MessageHeader(Common_1.MessageType.confirm_req, new UInt16_1.default({ octetArray: [0x06, 0x05] }), new UInt8_1.default({ octetArray: [0x01] }), new UInt8_1.default({ octetArray: [0x02] }), new UInt8_1.default({ octetArray: [0x03] }));
                actualBuffer = Buffer.alloc(0);
                writable = new stream_1.Writable({
                    write: function (chunk, encoding, callback) {
                        actualBuffer = Buffer.concat([actualBuffer, chunk]);
                        callback();
                    }
                });
                messageHeader.serialize(writable);
                expectedBuffer = Buffer.concat([
                    Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                    Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
                ]);
                assert(actualBuffer.equals(expectedBuffer));
                return [2 /*return*/];
            });
        }); });
    });
    describe('#from()', function () {
        it('should create the message header from the stream', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer, messageStream, messageHeader, expectedMessageHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x06, 0x05])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer);
                        return [4 /*yield*/, Common_1.MessageHeader.fromStream(messageStream)];
                    case 1:
                        messageHeader = _a.sent();
                        expectedMessageHeader = new Common_1.MessageHeader(Common_1.MessageType.confirm_req, new UInt16_1.default({ octetArray: [0x05, 0x06] }), new UInt8_1.default({ octetArray: [0x01] }), new UInt8_1.default({ octetArray: [0x02] }), new UInt8_1.default({ octetArray: [0x03] }));
                        assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax));
                        assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing));
                        assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin));
                        assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType);
                        assert(messageHeader.extensions.equals(expectedMessageHeader.extensions));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create the message header from the stream asynchronously on UInt8 boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer1, streamBuffer2, messageStream, messageHeader, expectedMessageHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer1 = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03])
                        ]);
                        streamBuffer2 = Buffer.concat([
                            Buffer.from([0x04, 0x06, 0x05])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer1);
                        setTimeout(function () { messageStream.write(streamBuffer2); }, 5);
                        return [4 /*yield*/, Common_1.MessageHeader.fromStream(messageStream)];
                    case 1:
                        messageHeader = _a.sent();
                        expectedMessageHeader = new Common_1.MessageHeader(Common_1.MessageType.confirm_req, new UInt16_1.default({ octetArray: [0x05, 0x06] }), new UInt8_1.default({ octetArray: [0x01] }), new UInt8_1.default({ octetArray: [0x02] }), new UInt8_1.default({ octetArray: [0x03] }));
                        assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax));
                        assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing));
                        assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin));
                        assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType);
                        assert(messageHeader.extensions.equals(expectedMessageHeader.extensions));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create the message header from the stream asynchronously on UInt16 boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer1, streamBuffer2, messageStream, messageHeader, expectedMessageHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer1 = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x06])
                        ]);
                        streamBuffer2 = Buffer.from([0x05]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer1);
                        setTimeout(function () { messageStream.write(streamBuffer2); }, 5);
                        return [4 /*yield*/, Common_1.MessageHeader.fromStream(messageStream)];
                    case 1:
                        messageHeader = _a.sent();
                        expectedMessageHeader = new Common_1.MessageHeader(Common_1.MessageType.confirm_req, new UInt16_1.default({ octetArray: [0x05, 0x06] }), new UInt8_1.default({ octetArray: [0x01] }), new UInt8_1.default({ octetArray: [0x02] }), new UInt8_1.default({ octetArray: [0x03] }));
                        assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax));
                        assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing));
                        assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin));
                        assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType);
                        assert(messageHeader.extensions.equals(expectedMessageHeader.extensions));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create the message header from a short stream at UInt16 boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidStreamBuffer, messageStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidStreamBuffer = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(invalidStreamBuffer);
                        messageStream.end();
                        return [4 /*yield*/, assert.rejects(Common_1.MessageHeader.fromStream(messageStream))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create the message header after a timeout', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer1, streamBuffer2, messageStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer1 = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
                        ]);
                        streamBuffer2 = Buffer.from([0x06]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer1);
                        setTimeout(function () { messageStream.write(streamBuffer2); }, 20);
                        return [4 /*yield*/, assert.rejects(Common_1.MessageHeader.fromStream(messageStream, 10))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create the message header after stream ends unexpectedly on UInt16 boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer, messageStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer);
                        setTimeout(function () { messageStream.end(); }, 10);
                        return [4 /*yield*/, assert.rejects(Common_1.MessageHeader.fromStream(messageStream))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create the message header after stream ends unexpectedly on UInt8 boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var streamBuffer, messageStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamBuffer = Buffer.concat([
                            Common_2.NetworkParams.getHeaderMagicNumber().asBuffer(),
                            Buffer.from([0x01, 0x02, 0x03])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(streamBuffer);
                        setTimeout(function () { messageStream.end(); }, 10);
                        return [4 /*yield*/, assert.rejects(Common_1.MessageHeader.fromStream(messageStream))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create the message header from an invalid magic number', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidStreamBuffer, messageStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidStreamBuffer = Buffer.concat([
                            Buffer.from([0xbe, 0xef]),
                            Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
                        ]);
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(invalidStreamBuffer);
                        return [4 /*yield*/, assert.rejects(Common_1.MessageHeader.fromStream(messageStream))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // FIXME: Fragile: could break if magic number in header changes
        it('should create the message header from binary stream', function () { return __awaiter(void 0, void 0, void 0, function () {
            var binaryFile, messageStream, messageHeader, expectedMessageHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readFile('test/testFiles/2020-12-24T17:35:26.895Z.SendHandshakeTest.bin')];
                    case 1:
                        binaryFile = _a.sent();
                        messageStream = new stream_1.PassThrough();
                        messageStream.write(binaryFile);
                        return [4 /*yield*/, Common_1.MessageHeader.fromStream(messageStream)];
                    case 2:
                        messageHeader = _a.sent();
                        expectedMessageHeader = new Common_1.MessageHeader(Common_1.MessageType.node_id_handshake, new UInt16_1.default({ octetArray: [0x00, 0x03] }), new UInt8_1.default({ octetArray: [0x12] }), new UInt8_1.default({ octetArray: [0x12] }), new UInt8_1.default({ octetArray: [0x11] }));
                        assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax));
                        assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing));
                        assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin));
                        assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType);
                        assert(messageHeader.extensions.equals(expectedMessageHeader.extensions));
                        return [2 /*return*/];
                }
            });
        }); });
        // FIXME: Fragile: could break if magic number in header changes
        it('should create the message header from a buffer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var binaryFile, messageHeader, expectedMessageHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readFile('test/testFiles/2020-12-24T17:35:26.895Z.SendHandshakeTest.bin')];
                    case 1:
                        binaryFile = _a.sent();
                        return [4 /*yield*/, Common_1.MessageHeader.fromBuffer(binaryFile)];
                    case 2:
                        messageHeader = _a.sent();
                        expectedMessageHeader = new Common_1.MessageHeader(Common_1.MessageType.node_id_handshake, new UInt16_1.default({ octetArray: [0x00, 0x03] }), new UInt8_1.default({ octetArray: [0x12] }), new UInt8_1.default({ octetArray: [0x12] }), new UInt8_1.default({ octetArray: [0x11] }));
                        assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax));
                        assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing));
                        assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin));
                        assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType);
                        assert(messageHeader.extensions.equals(expectedMessageHeader.extensions));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=TestMessageHeader.js.map