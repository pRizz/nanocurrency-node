"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt32 = /** @class */ (function () {
    function UInt32(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt32.getBitCount = function () {
        return UInt32.bitCount;
    };
    UInt32.getByteCount = function () {
        return UInt32.byteCount;
    };
    UInt32.prototype.getBitCount = function () {
        return UInt32.bitCount;
    };
    UInt32.getRandom = function () {
        return new UInt32({ uint8Array: crypto.randomBytes(UInt32.byteCount) });
    };
    UInt32.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt32.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt32.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt32.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt32.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt32.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt32.bitCount = 32;
    UInt32.byteCount = UInt32.bitCount >>> 3;
    return UInt32;
}());
exports.default = UInt32;
//# sourceMappingURL=UInt32.js.map