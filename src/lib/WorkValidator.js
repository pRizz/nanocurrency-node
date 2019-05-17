"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var blakejs = require('blakejs');
function workValue(blockHash, work) {
    var hashContext = blakejs.blake2bInit(8);
    blakejs.blake2bUpdate(hashContext, work.asUint8Array());
    blakejs.blake2bUpdate(hashContext, blockHash.asUint8Array());
    return blakejs.blake2bFinal(hashContext);
}
function validate(blockHash, work, difficulty) {
    var value = workValue(blockHash, work);
    return value.lessThan(Config_1.default.publishThreshold);
}
exports.default = validate;
//# sourceMappingURL=WorkValidator.js.map