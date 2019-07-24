"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignatureVerifier_1 = require("../lib/SignatureVerifier");
var SignatureChecker = /** @class */ (function () {
    function SignatureChecker(signatureCheckerThreads) {
        this.signatureCheckerThreads = signatureCheckerThreads;
    }
    SignatureChecker.verify = function (signatureVerifiable) {
        return SignatureVerifier_1.default.verify(signatureVerifiable.message, signatureVerifiable.signature.value.asUint8Array(), signatureVerifiable.publicKey);
    };
    SignatureChecker.prototype.stop = function () {
        // TODO
    };
    return SignatureChecker;
}());
exports.SignatureChecker = SignatureChecker;
//# sourceMappingURL=Signatures.js.map