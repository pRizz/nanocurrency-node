"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256 = /** @class */ (function () {
    function UInt256(props) {
        this.value = Buffer.alloc(UInt256.byteCount); // Big Endian
        if (!props) {
            return;
        }
        if (props.hex) {
            this.value = Buffer.from(props.hex, 'hex');
            return;
        }
        if (props.uint8Array) {
            if (props.uint8Array.length !== UInt256.byteCount) {
                throw 'Uint8Array is an invalid size';
            }
            this.value = Buffer.from(props.uint8Array);
            return;
        }
    }
    UInt256.prototype.asUint8Array = function () {
        return new Uint8Array(this.value);
    };
    UInt256.bitCount = 256;
    UInt256.byteCount = UInt256.bitCount / 8;
    return UInt256;
}());
exports.default = UInt256;
//# sourceMappingURL=UInt256.js.map