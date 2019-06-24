"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt64 = /** @class */ (function () {
    function UInt64(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt64.getBitCount = function () {
        return UInt64.bitCount;
    };
    UInt64.getByteCount = function () {
        return UInt64.byteCount;
    };
    UInt64.prototype.getBitCount = function () {
        return UInt64.bitCount;
    };
    UInt64.getRandom = function () {
        return new UInt64({ uint8Array: crypto.randomBytes(UInt64.byteCount) });
    };
    UInt64.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt64.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt64.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt64.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt64.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt64.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt64.bitCount = 64;
    UInt64.byteCount = UInt64.bitCount >>> 3;
    return UInt64;
}());
exports.default = UInt64;
//# sourceMappingURL=UInt64.js.map