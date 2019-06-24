"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt256 = /** @class */ (function () {
    function UInt256(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt256.getBitCount = function () {
        return UInt256.bitCount;
    };
    UInt256.getByteCount = function () {
        return UInt256.byteCount;
    };
    UInt256.prototype.getBitCount = function () {
        return UInt256.bitCount;
    };
    UInt256.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt256.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt256.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt256.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt256.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt256.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt256.bitCount = 256;
    UInt256.byteCount = UInt256.bitCount >>> 3;
    return UInt256;
}());
exports.default = UInt256;
//# sourceMappingURL=UInt256.js.map