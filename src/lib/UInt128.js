"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedInteger_1 = require("./UnsignedInteger");
var blakejs = require('blakejs');
var UInt128 = /** @class */ (function () {
    function UInt128(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt128.getBitCount = function () {
        return UInt128.bitCount;
    };
    UInt128.getByteCount = function () {
        return UInt128.byteCount;
    };
    UInt128.prototype.getBitCount = function () {
        return UInt128.bitCount;
    };
    UInt128.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt128.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt128.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt128.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt128.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt128.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt128.bitCount = 128;
    UInt128.byteCount = UInt128.bitCount >>> 3;
    return UInt128;
}());
exports.default = UInt128;
//# sourceMappingURL=UInt128.js.map