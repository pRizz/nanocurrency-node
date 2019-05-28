"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("../src/lib/UInt256");
var assert = require("assert");
var MessageSigner_1 = require("../src/lib/MessageSigner");
var UInt512_1 = require("../src/lib/UInt512");
var SignatureVerifier_1 = require("../src/lib/SignatureVerifier");
describe('SignatureVerifier', function () {
    describe('#verify()', function () {
        it('should assert a valid signature', function () {
            var secretKey = new Uint8Array([131, 242, 95, 55, 29, 48, 155, 172, 182, 222, 93, 66, 21, 222, 241, 157, 69, 61, 132, 180, 33, 110, 120, 4, 192, 91, 166, 133, 118, 197, 45, 119, 46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184]);
            var message = Buffer.from('testing');
            var signature = MessageSigner_1.default.sign(new UInt512_1.default({ uint8Array: secretKey }), message);
            var publicKey = new Uint8Array([46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184]);
            assert(SignatureVerifier_1.default.verify(new Uint8Array(message), signature.asUint8Array(), new UInt256_1.default({ uint8Array: publicKey })));
        });
    });
});
describe('SignatureVerifier', function () {
    describe('#verify()', function () {
        it('should not assert an invalid signature', function () {
            var secretKey = new Uint8Array([131, 242, 95, 55, 29, 48, 155, 172, 182, 222, 93, 66, 21, 222, 241, 157, 69, 61, 132, 180, 33, 110, 120, 4, 192, 91, 166, 133, 118, 197, 45, 119, 46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184]);
            var message = Buffer.from('testing');
            var signature = MessageSigner_1.default.sign(new UInt512_1.default({ uint8Array: secretKey }), message);
            var publicKey = new Uint8Array([46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184]);
            var modifiedSignature = signature.asUint8Array();
            modifiedSignature[0] = 0;
            assert(!SignatureVerifier_1.default.verify(new Uint8Array(message), modifiedSignature, new UInt256_1.default({ uint8Array: publicKey })));
        });
    });
});
//# sourceMappingURL=TestSignatureVerifier.js.map