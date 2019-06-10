"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignatureVerifier_1 = require("../lib/SignatureVerifier");
var SignatureChecker = /** @class */ (function () {
    function SignatureChecker() {
    }
    SignatureChecker.verify = function (signatureVerifiable) {
        return SignatureVerifier_1.default.verify(signatureVerifiable.message, signatureVerifiable.signature.value.asUint8Array(), signatureVerifiable.publicKey);
    };
    return SignatureChecker;
}());
exports.SignatureChecker = SignatureChecker;
//# sourceMappingURL=Signatures.js.map