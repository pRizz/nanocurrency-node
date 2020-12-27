"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureChecker = void 0;
var SignatureVerifier_1 = require("../lib/SignatureVerifier");
// FIXME: consolidate this class and SignatureVerifier
var SignatureChecker = /** @class */ (function () {
    function SignatureChecker(signatureCheckerThreads) {
        this.signatureCheckerThreads = signatureCheckerThreads;
    }
    SignatureChecker.verify = function (signatureVerifiable) {
        return SignatureVerifier_1.default.verify(signatureVerifiable.message, signatureVerifiable.signature, signatureVerifiable.publicKey);
    };
    SignatureChecker.verifyHandshakeResponse = function (sentChallengeQuery, handshakeResponse) {
        return this.verify({
            message: sentChallengeQuery.asUint8Array(),
            signature: handshakeResponse.signature,
            publicKey: handshakeResponse.account.publicKey
        });
    };
    SignatureChecker.prototype.stop = function () {
        throw 0; // FIXME
    };
    return SignatureChecker;
}());
exports.SignatureChecker = SignatureChecker;
//# sourceMappingURL=Signatures.js.map