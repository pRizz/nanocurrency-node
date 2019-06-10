"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockHash = /** @class */ (function () {
    function BlockHash(hashValue) {
        this.value = hashValue;
    }
    BlockHash.prototype.isZero = function () {
        return this.value.isZero();
    };
    return BlockHash;
}());
exports.default = BlockHash;
//# sourceMappingURL=BlockHash.js.map