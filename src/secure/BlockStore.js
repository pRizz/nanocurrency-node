"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadTransaction = /** @class */ (function () {
    function ReadTransaction(readTransactionImpl) {
        this.readTransactionImpl = readTransactionImpl;
    }
    ReadTransaction.prototype.getHandle = function () {
        // TODO
    };
    return ReadTransaction;
}());
exports.ReadTransaction = ReadTransaction;
var WriteTransaction = /** @class */ (function () {
    function WriteTransaction(writeTransactionImpl) {
        this.writeTransactionImpl = writeTransactionImpl;
    }
    WriteTransaction.prototype.getHandle = function () {
        // TODO
    };
    return WriteTransaction;
}());
exports.WriteTransaction = WriteTransaction;
//# sourceMappingURL=BlockStore.js.map