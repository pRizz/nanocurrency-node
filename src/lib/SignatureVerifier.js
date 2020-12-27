"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = require("tweetnacl-blake2b");
var Numbers_1 = require("./Numbers");
var SignatureVerifier;
(function (SignatureVerifier) {
    function verify(message, signature, publicKey) {
        if (signature instanceof Numbers_1.Signature) {
            signature = signature.value;
        }
        return nacl.sign.detached.verify(message, signature.asUint8Array(), publicKey.asUint8Array());
    }
    SignatureVerifier.verify = verify;
})(SignatureVerifier || (SignatureVerifier = {}));
exports.default = SignatureVerifier;
//# sourceMappingURL=SignatureVerifier.js.map