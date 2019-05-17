"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64 = /** @class */ (function () {
    function UInt64(number) {
        //FIXME
        this.value = Buffer.from(number);
    }
    UInt64.prototype.lessThan = function (other) {
        return this.value.compare(other.value) < 0; // FIXME
    };
    UInt64.prototype.asUint8Array = function () {
        return new Uint8Array(this.value);
    };
    return UInt64;
}());
exports.default = UInt64;
//# sourceMappingURL=UInt64.js.map