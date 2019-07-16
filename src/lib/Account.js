"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("./UInt256");
var blakejs = require('blakejs');
var nanoAlphabet = '13456789abcdefghijkmnopqrstuwxyz';
var Account = /** @class */ (function () {
    function Account(publicKey) {
        this.publicKey = publicKey;
    }
    Account.fromPublicKeyHex = function (hex) {
        return new Account(new UInt256_1.default({ hex: hex }));
    };
    Account.prototype.isZero = function () {
        return this.publicKey.isZero();
    };
    Account.prototype.equals = function (other) {
        return this.publicKey.equals(other.publicKey);
    };
    Account.prototype.toNANOAddress = function () {
        if (this.computedAddress) {
            return this.computedAddress;
        }
        var checksum = blakejs.blake2b(this.publicKey.asBuffer(), null, 5).reverse();
        var bufferWithChecksum = Buffer.concat([this.publicKey.asBuffer(), checksum]);
        var encodedCharacterArray = [];
        var bitsToExtract = 5;
        var lowest5BitsMask = 0x1f;
        var usableBitCount = 0;
        var lowestBits = 0;
        for (var i = 0; i < bufferWithChecksum.length; ++i) {
            lowestBits |= bufferWithChecksum.readUInt8(bufferWithChecksum.length - 1 - i) << usableBitCount;
            usableBitCount += 8;
            while (usableBitCount >= bitsToExtract) {
                var encodedCharacter = nanoAlphabet[lowestBits & lowest5BitsMask];
                encodedCharacterArray.unshift(encodedCharacter);
                lowestBits >>>= bitsToExtract;
                usableBitCount -= bitsToExtract;
            }
        }
        if (usableBitCount >= 1) {
            var encodedCharacter = nanoAlphabet[lowestBits & lowest5BitsMask];
            encodedCharacterArray.unshift(encodedCharacter);
        }
        var encodedString = "nano_" + encodedCharacterArray.join('');
        this.computedAddress = encodedString;
        return encodedString;
    };
    return Account;
}());
exports.default = Account;
//# sourceMappingURL=Account.js.map