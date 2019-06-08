"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockHash_1 = require("./BlockHash");
var UInt256_1 = require("./UInt256");
var blakejs = require('blakejs');
// TODO: Test
function produceSendBlockHash(sendBlockHashables) {
    var hashContext = blakejs.blake2bInit(32);
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.previousBlockHash.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.destinationAccount.publicKey.asUint8Array());
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.balance.value.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new BlockHash_1.default(new UInt256_1.default({ uint8Array: result }));
}
// TODO: Test
function produceReceiveBlockHash(receiveBlockHashables) {
    var hashContext = blakejs.blake2bInit(32);
    blakejs.blake2bUpdate(hashContext, receiveBlockHashables.previousBlockHash.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, receiveBlockHashables.sourceBlockHash.value.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new BlockHash_1.default(new UInt256_1.default({ uint8Array: result }));
}
// TODO: Test
function produceOpenBlockHash(openBlockHashables) {
    var hashContext = blakejs.blake2bInit(32);
    blakejs.blake2bUpdate(hashContext, openBlockHashables.sourceBlockHash.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, openBlockHashables.representativeAccount.publicKey.asUint8Array());
    blakejs.blake2bUpdate(hashContext, openBlockHashables.account.publicKey.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new BlockHash_1.default(new UInt256_1.default({ uint8Array: result }));
}
// TODO: Test
function produceChangeBlockHash(changeBlockHashables) {
    var hashContext = blakejs.blake2bInit(32);
    blakejs.blake2bUpdate(hashContext, changeBlockHashables.previousBlockHash.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, changeBlockHashables.representativeAccount.publicKey.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new BlockHash_1.default(new UInt256_1.default({ uint8Array: result }));
}
// TODO: Test
function produceStateBlockHash(stateBlockHashables) {
    var hashContext = blakejs.blake2bInit(32);
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.account.publicKey.asUint8Array());
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.previousBlockHash.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.representativeAccount.publicKey.asUint8Array());
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.balance.value.asUint8Array());
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.link.asUint8Array());
    var result = blakejs.blake2bFinal(hashContext).reverse();
    return new BlockHash_1.default(new UInt256_1.default({ uint8Array: result }));
}
//# sourceMappingURL=Block.js.map