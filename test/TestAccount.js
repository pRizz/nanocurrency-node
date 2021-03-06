"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("../src/lib/UInt256");
var assert = require("assert");
var Account_1 = require("../src/lib/Account");
describe('Account', function () {
    describe('#toNANOAddress()', function () {
        it('should produce a nano address when called', function () {
            var publicKey = new UInt256_1.default({
                hex: '418E563DBCA81071C021FB1768E069B9D5CA2B2A46E6FBF4993C1C1F2A3FE1BC'
            });
            var account = new Account_1.default(publicKey);
            assert.strictEqual(account.toNANOAddress(), 'nano_1iegcryusc1ig9145yrqf5i8mggosaoknjq8zhtbkh1w5wo5zrfwuq8r4fmj');
        });
        it('should produce a nano address when called', function () {
            var publicKey = new UInt256_1.default({
                hex: '9FA7BCF682CD1E683370E989D02F2A2BA99A738D2BBFDA04A5826F1D852D3992'
            });
            var account = new Account_1.default(publicKey);
            assert.strictEqual(account.toNANOAddress(), 'nano_39x9qmua7mayf1sq3tebt1qkncxbmbsrtcxzua4cd1mh5p4ktgekpdc9rabc');
        });
    });
});
//# sourceMappingURL=TestAccount.js.map