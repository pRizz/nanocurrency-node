"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var Config_1 = require("./Config");
var blakejs = require('blakejs');
// FIXME: might have to signify endianness
function getWorkValue(blockHash, work) {
    var hashContext = blakejs.blake2bInit(8);
    blakejs.blake2bUpdate(hashContext, work.value.asUint8Array().reverse());
    blakejs.blake2bUpdate(hashContext, blockHash.value.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new UInt64_1.default({ uint8Array: result });
}
var WorkValidator;
(function (WorkValidator) {
    function isWorkValid(blockHash, work) {
        var workValue = getWorkValue(blockHash, work);
        return workValue.greaterThanOrEqualTo(Config_1.NetworkConstants.publishThresholdDifficulty);
    }
    WorkValidator.isWorkValid = isWorkValid;
    function isUncheckedInfoValid(uncheckedInfo) {
        return isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork());
    }
    WorkValidator.isUncheckedInfoValid = isUncheckedInfoValid;
})(WorkValidator || (WorkValidator = {}));
exports.default = WorkValidator;
//# sourceMappingURL=WorkValidator.js.map