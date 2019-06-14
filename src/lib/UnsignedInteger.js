"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnsignedIntegerProps = /** @class */ (function () {
    function UnsignedIntegerProps() {
    }
    return UnsignedIntegerProps;
}());
exports.UnsignedIntegerProps = UnsignedIntegerProps;
var UnsignedIntegerImpl = /** @class */ (function () {
    function UnsignedIntegerImpl(unsignedInteger, unsignedIntegerProps) {
        this._isZero = null;
        this.bitCount = unsignedInteger.getBitCount();
        this.byteCount = this.bitCount / 8;
        if (unsignedIntegerProps === null) {
            this.buffer = Buffer.alloc(this.byteCount);
            return;
        }
        if (unsignedIntegerProps.hex) {
            this.buffer = Buffer.from(unsignedIntegerProps.hex, 'hex');
            return;
        }
        if (unsignedIntegerProps.uint8Array) {
            if (unsignedIntegerProps.uint8Array.length !== this.byteCount) {
                throw "Uint8Array prop is an invalid length. Expected " + this.byteCount + " but was " + unsignedIntegerProps.uint8Array.length;
            }
            this.buffer = Buffer.from(unsignedIntegerProps.uint8Array);
            return;
        }
        this.buffer = Buffer.alloc(this.byteCount);
    }
    UnsignedIntegerImpl.prototype.lessThan = function (other) {
        return this.asBuffer().compare(other.asBuffer()) === -1;
    };
    UnsignedIntegerImpl.prototype.greaterThanOrEqualTo = function (other) {
        return !this.lessThan(other);
    };
    UnsignedIntegerImpl.prototype.equals = function (other) {
        return this.asBuffer().equals(other.asBuffer());
    };
    UnsignedIntegerImpl.prototype.asUint8Array = function () {
        return new Uint8Array(this.buffer);
    };
    UnsignedIntegerImpl.prototype.asBuffer = function () {
        return this.buffer;
    };
    UnsignedIntegerImpl.prototype.getBitCount = function () {
        return this.bitCount;
    };
    UnsignedIntegerImpl.prototype.isZero = function () {
        if (this._isZero !== null) {
            return this._isZero;
        }
        var zeroBuffer = Buffer.alloc(this.byteCount);
        return this._isZero = this.asBuffer().equals(zeroBuffer);
    };
    return UnsignedIntegerImpl;
}());
exports.UnsignedIntegerImpl = UnsignedIntegerImpl;
//# sourceMappingURL=UnsignedInteger.js.map