"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockHash = /** @class */ (function () {
    function BlockHash(hashValue) {
        this.value = hashValue;
    }
    BlockHash.prototype.isZero = function () {
        return this.value.isZero();
    };
    BlockHash.prototype.toString = function () {
        return this.value.asBuffer().toString('hex');
    };
    BlockHash.prototype.equals = function (other) {
        return this.value.equals(other.value);
    };
    return BlockHash;
}());
exports.default = BlockHash;
//# sourceMappingURL=BlockHash.js.map