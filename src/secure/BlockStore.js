"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadTransaction = /** @class */ (function () {
    function ReadTransaction(readTransactionImpl) {
        this.readTransactionImpl = readTransactionImpl;
    }
    ReadTransaction.prototype.getHandle = function () {
        throw 0; // FIXME
    };
    ReadTransaction.prototype.finalize = function () {
        throw 0; // FIXME
    };
    return ReadTransaction;
}());
exports.ReadTransaction = ReadTransaction;
var WriteTransaction = /** @class */ (function () {
    function WriteTransaction(writeTransactionImpl) {
        this.writeTransactionImpl = writeTransactionImpl;
    }
    WriteTransaction.prototype.getHandle = function () {
        throw 0; // FIXME
    };
    WriteTransaction.prototype.finalize = function () {
        throw 0; // FIXME
    };
    return WriteTransaction;
}());
exports.WriteTransaction = WriteTransaction;
var DBNoValue = /** @class */ (function () {
    function DBNoValue() {
    }
    DBNoValue.fromDBBuffer = function (mdbBuffer) {
        return new DBNoValue();
    };
    DBNoValue.prototype.asBuffer = function () {
        return Buffer.alloc(0);
    };
    DBNoValue.prototype.getDBSize = function () {
        return 0;
    };
    DBNoValue.prototype.equals = function (other) {
        return true;
    };
    return DBNoValue;
}());
exports.DBNoValue = DBNoValue;
//# sourceMappingURL=BlockStore.js.map