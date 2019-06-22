import UInt256 from '../src/lib/UInt256'
import * as assert from 'assert'
import Account from "../src/lib/Account";

describe('Account', () => {
    describe('#toNANOAddress()', () => {
        it('should produce a nano address when called', () => {
            const publicKey = new UInt256({
                hex: '418E563DBCA81071C021FB1768E069B9D5CA2B2A46E6FBF4993C1C1F2A3FE1BC'
            })
            const account = new Account(publicKey)
            assert.strictEqual(account.toNANOAddress(), 'nano_1iegcryusc1ig9145yrqf5i8mggosaoknjq8zhtbkh1w5wo5zrfwuq8r4fmj');
        });
        it('should produce a nano address when called', () => {
            const publicKey = new UInt256({
                hex: '9FA7BCF682CD1E683370E989D02F2A2BA99A738D2BBFDA04A5826F1D852D3992'
            })
            const account = new Account(publicKey)
            assert.strictEqual(account.toNANOAddress(), 'nano_39x9qmua7mayf1sq3tebt1qkncxbmbsrtcxzua4cd1mh5p4ktgekpdc9rabc');
        });
    });
});
