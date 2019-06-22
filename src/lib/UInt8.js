"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedInteger_1 = require("./UnsignedInteger");
var UInt8 = /** @class */ (function () {
    function UInt8(props) {
        this.unsignedIntegerImpl = new UnsignedInteger_1.UnsignedIntegerImpl(this, props);
    }
    UInt8.prototype.getBitCount = function () {
        return UInt8.bitCount;
    };
    UInt8.prototype.asUint8Array = function () {
        return this.unsignedIntegerImpl.asUint8Array();
    };
    UInt8.prototype.asBuffer = function () {
        return this.unsignedIntegerImpl.asBuffer();
    };
    UInt8.prototype.lessThan = function (other) {
        return this.unsignedIntegerImpl.lessThan(other);
    };
    UInt8.prototype.greaterThanOrEqualTo = function (other) {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other);
    };
    UInt8.prototype.equals = function (other) {
        return this.unsignedIntegerImpl.equals(other);
    };
    UInt8.prototype.isZero = function () {
        return this.unsignedIntegerImpl.isZero();
    };
    UInt8.bitCount = 8;
    return UInt8;
}());
exports.default = UInt8;
//# sourceMappingURL=UInt8.js.map