"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt512 = /** @class */ (function () {
    function UInt512(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt512.getBitCount = function () {
        return UInt512.bitCount;
    };
    UInt512.getByteCount = function () {
        return UInt512.byteCount;
    };
    UInt512.prototype.getBitCount = function () {
        return UInt512.bitCount;
    };
    UInt512.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt512.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt512.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt512.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt512.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt512.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt512.bitCount = 512;
    UInt512.byteCount = UInt512.bitCount >>> 3;
    return UInt512;
}());
exports.default = UInt512;
//# sourceMappingURL=UInt512.js.map