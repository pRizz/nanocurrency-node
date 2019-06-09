"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256 = /** @class */ (function () {
    function UInt256(props) {
        this.value = Buffer.alloc(UInt256.byteCount); // Big Endian
        this._isZero = null;
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
    UInt256.prototype.isZero = function () {
        var e_1, _a;
        if (this._isZero !== null) {
            return this._isZero;
        }
        try {
            for (var _b = __values(this.value), _c = _b.next(); !_c.done; _c = _b.next()) {
                var byte = _c.value;
                if (byte !== 0) {
                    return this._isZero = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this._isZero = true;
    };
    UInt256.bitCount = 256;
    UInt256.byteCount = UInt256.bitCount / 8;
    return UInt256;
}());
exports.default = UInt256;
//# sourceMappingURL=UInt256.js.map