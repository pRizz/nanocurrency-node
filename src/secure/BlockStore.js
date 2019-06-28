"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockStore = /** @class */ (function () {
    function BlockStore() {
    }
    //TODO: implement
    BlockStore.prototype.txBeginRead = function () {
        return {};
    };
    BlockStore.prototype.txBeginWrite = function () {
        return {}; // FIXME
    };
    //TODO: implement
    BlockStore.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return false;
    };
    return BlockStore;
}());
exports.BlockStore = BlockStore;
//# sourceMappingURL=BlockStore.js.map