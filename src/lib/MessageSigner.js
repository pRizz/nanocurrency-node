"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt512_1 = require("./UInt512");
var nacl = require('tweetnacl');
var MessageSigner;
(function (MessageSigner) {
    // FIXME: use blake2b as hashing for signing
    function sign(secretKey, message) {
        var signature = nacl.sign.detached(new Uint8Array(message), secretKey.asUint8Array());
        return new UInt512_1.default({ uint8Array: signature });
    }
    MessageSigner.sign = sign;
})(MessageSigner || (MessageSigner = {}));
exports.default = MessageSigner;
//# sourceMappingURL=MessageSigner.js.map