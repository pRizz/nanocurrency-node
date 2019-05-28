"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var MessageSigner_1 = require("../src/lib/MessageSigner");
var UInt512_1 = require("../src/lib/UInt512");
var crypto = require('crypto');
var nacl = require('tweetnacl');
describe('MessageSigner', function () {
    describe('#sign()', function () {
        it('should produce a signature', function () {
            var secretKey = new Uint8Array([131, 242, 95, 55, 29, 48, 155, 172, 182, 222, 93, 66, 21, 222, 241, 157, 69, 61, 132, 180, 33, 110, 120, 4, 192, 91, 166, 133, 118, 197, 45, 119, 46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184]);
            var message = Buffer.from('hello world!', 'hex');
            var signature = MessageSigner_1.default.sign(new UInt512_1.default({ uint8Array: secretKey }), message);
            var expectedSignature = 'bc6109eba9ba358071e7cdf455df6f27b6be072696e897c80923d9895171343966c5dd5a53c223987c6ce494a758e43e0ee43991bcf341d3f670b08cb5cf3900';
            assert.strictEqual(signature.toString(), expectedSignature);
        });
    });
});
//# sourceMappingURL=TestMessageSigner.js.map