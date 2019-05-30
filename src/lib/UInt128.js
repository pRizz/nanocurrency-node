"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blakejs = require('blakejs');
var UInt128 = /** @class */ (function () {
    function UInt128(props) {
        this.value = Buffer.alloc(UInt128.byteCount); // Big Endian
        if (!props) {
            return;
        }
        if (props.hex) {
            this.value = Buffer.from(props.hex, 'hex');
            return;
        }
        if (props.buffer) {
            if (props.buffer.length !== UInt128.byteCount) {
                throw 'Buffer is an invalid size';
            }
            this.value = Buffer.from(props.buffer);
            return;
        }
        if (props.uint8Array) {
            if (props.uint8Array.length !== UInt128.byteCount) {
                throw 'Uint8Array is an invalid size';
            }
            this.value = Buffer.from(props.uint8Array);
            return;
        }
    }
    UInt128.prototype.asUint8Array = function () {
        return new Uint8Array(this.value);
    };
    UInt128.prototype.toString = function () {
        return this.value.toString('hex');
    };
    UInt128.bitCount = 128;
    UInt128.byteCount = UInt128.bitCount / 8;
    return UInt128;
}());
exports.default = UInt128;
//# sourceMappingURL=UInt128.js.map