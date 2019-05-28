"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var UInt64 = /** @class */ (function () {
    function UInt64(props) {
        this.value = Buffer.alloc(8); // Big Endian
        if (!props) {
            this.value = Buffer.alloc(8);
            return;
        }
        if (props.hex) {
            this.value = Buffer.from(props.hex, 'hex');
            return;
        }
        if (props.uint8Array) {
            if (props.uint8Array.length !== 8) {
                throw 'Uint8Array is an invalid size';
            }
            this.value = Buffer.from(props.uint8Array);
            return;
        }
    }
    UInt64.getRandom = function () {
        return new UInt64({ uint8Array: crypto.randomBytes(8) });
    };
    UInt64.prototype.lessThan = function (other) {
        return this.value.compare(other.value) === -1;
    };
    UInt64.prototype.greaterThanOrEqualTo = function (other) {
        return !this.lessThan(other);
    };
    UInt64.prototype.asUint8Array = function () {
        return new Uint8Array(this.value);
    };
    return UInt64;
}());
exports.default = UInt64;
//# sourceMappingURL=UInt64.js.map