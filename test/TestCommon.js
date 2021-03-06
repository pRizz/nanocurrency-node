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
var ipaddr = require("ipaddr.js");
describe('Common', function () {
    describe('#bufferFromSerializable()', function () {
        it('should create a buffer from a serializable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputBuffer, serializable, outputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputBuffer = Buffer.from([0x01, 0x02]);
                        serializable = {
                            serialize: function (stream) {
                                stream.write(inputBuffer);
                            }
                        };
                        return [4 /*yield*/, Common_1.bufferFromSerializable(serializable)];
                    case 1:
                        outputBuffer = _a.sent();
                        assert(inputBuffer.equals(outputBuffer));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('UDPEndpoint#toDBBuffer()', function () {
        it('should create a DB buffer from a UDPEndpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ipv6, ip, udpEndpoint, udpDBBuffer;
            return __generator(this, function (_a) {
                ipv6 = ipaddr.IPv6.parse('1::1');
                ip = new Common_1.IPAddress(ipv6);
                udpEndpoint = new Common_1.UDPEndpoint(ip, 10);
                udpDBBuffer = udpEndpoint.toDBBuffer();
                assert(Buffer.from('00010000000000000000000000000001000a', 'hex').equals(udpDBBuffer));
                return [2 /*return*/];
            });
        }); });
    });
    describe('UDPEndpoint#fromDB()', function () {
        it('should create a UDPEndpoint from a DB buffer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var udpEndpoint, ipv6, ip, expectedUDPEndpoint;
            return __generator(this, function (_a) {
                udpEndpoint = Common_1.UDPEndpoint.fromDB(Buffer.from('00ff00000000000000000000000000ab0019', 'hex'));
                ipv6 = ipaddr.IPv6.parse('ff::ab');
                ip = new Common_1.IPAddress(ipv6);
                expectedUDPEndpoint = new Common_1.UDPEndpoint(ip, 25);
                assert(udpEndpoint.equals(expectedUDPEndpoint));
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=TestCommon.js.map