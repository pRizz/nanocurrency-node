"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt16 = /** @class */ (function () {
    function UInt16(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt16.getBitCount = function () {
        return UInt16.bitCount;
    };
    UInt16.getByteCount = function () {
        return UInt16.byteCount;
    };
    UInt16.prototype.getBitCount = function () {
        return UInt16.bitCount;
    };
    UInt16.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt16.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt16.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt16.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt16.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt16.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt16.bitCount = 16;
    UInt16.byteCount = UInt16.bitCount >>> 3;
    return UInt16;
}());
exports.default = UInt16;
//# sourceMappingURL=UInt16.js.map