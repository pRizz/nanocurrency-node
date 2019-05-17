"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blakejs = require('blakejs');
var nanoAlphabet = '13456789abcdefghijkmnopqrstuwxyz';
var UInt256 = /** @class */ (function () {
    function UInt256(props) {
        this.number = Buffer.alloc(32);
        if (!props) {
            return;
        }
        if (props.hex) {
            this.number = Buffer.from(props.hex, 'hex');
            return;
        }
    }
    UInt256.prototype.toAccount = function () {
        var checksum = blakejs.blake2b(this.number, null, 5).reverse();
        var bufferWithChecksum = Buffer.concat([this.number, checksum]);
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
        return encodedString;
    };
    return UInt256;
}());
exports.default = UInt256;
//# sourceMappingURL=UInt256.js.map