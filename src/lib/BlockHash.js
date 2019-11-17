"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("./UInt256");
// TODO: remove dependency on MDBValueInterface
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
    BlockHash.prototype.getDBSize = function () {
        return UInt256_1.default.getByteCount();
    };
    BlockHash.prototype.asBuffer = function () {
        return this.value.asBuffer();
    };
    BlockHash.fromDBKeyBuffer = function (buffer) {
        return new BlockHash(new UInt256_1.default({ buffer: buffer }));
    };
    return BlockHash;
}());
exports.default = BlockHash;
//# sourceMappingURL=BlockHash.js.map