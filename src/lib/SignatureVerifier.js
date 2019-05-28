"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = require("tweetnacl");
var SignatureVerifier;
(function (SignatureVerifier) {
    function verify(message, signature, publicKey) {
        return nacl.sign.detached.verify(message, signature, publicKey.asUint8Array());
    }
    SignatureVerifier.verify = verify;
})(SignatureVerifier || (SignatureVerifier = {}));
exports.default = SignatureVerifier;
//# sourceMappingURL=SignatureVerifier.js.map