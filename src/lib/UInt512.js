"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blakejs = require('blakejs');
var UInt512 = /** @class */ (function () {
    function UInt512(props) {
        this.value = Buffer.alloc(64); // Big Endian
        if (!props) {
            return;
        }
        if (props.hex) {
            this.value = Buffer.from(props.hex, 'hex');
            return;
        }
        if (props.buffer) {
            if (props.buffer.length !== 64) {
                throw 'Buffer is an invalid size';
            }
            this.value = Buffer.from(props.buffer);
            return;
        }
        if (props.uint8Array) {
            if (props.uint8Array.length !== 64) {
                throw 'Uint8Array is an invalid size';
            }
            this.value = Buffer.from(props.uint8Array);
            return;
        }
    }
    UInt512.prototype.asUint8Array = function () {
        return new Uint8Array(this.value);
    };
    UInt512.prototype.toString = function () {
        return this.value.toString('hex');
    };
    return UInt512;
}());
exports.default = UInt512;
//# sourceMappingURL=UInt512.js.map