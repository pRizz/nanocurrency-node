import UInt256 from '../src/lib/UInt256'
import * as assert from 'assert'
import MessageSigner from "../src/lib/MessageSigner";
import UInt512 from "../src/lib/UInt512";
import SignatureVerifier from "../src/lib/SignatureVerifier";

describe('SignatureVerifier', () => {
    describe('#verify()', () => {
        it('should assert a valid signature', () => {
            const secretKey = new Uint8Array([131,242,95,55,29,48,155,172,182,222,93,66,21,222,241,157,69,61,132,180,33,110,120,4,192,91,166,133,118,197,45,119,46,135,102,118,84,123,132,242,106,233,2,202,243,172,161,111,249,20,138,247,80,41,121,129,245,94,34,147,114,252,77,184])

            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({ uint8Array: secretKey }), message)
            const publicKey = new Uint8Array([46,135,102,118,84,123,132,242,106,233,2,202,243,172,161,111,249,20,138,247,80,41,121,129,245,94,34,147,114,252,77,184])

            assert(SignatureVerifier.verify(new Uint8Array(message), signature.asUint8Array(), new UInt256({ uint8Array: publicKey})))
        });
    });
});

describe('SignatureVerifier', () => {
    describe('#verify()', () => {
        it('should not assert an invalid signature', () => {
            const secretKey = new Uint8Array([131,242,95,55,29,48,155,172,182,222,93,66,21,222,241,157,69,61,132,180,33,110,120,4,192,91,166,133,118,197,45,119,46,135,102,118,84,123,132,242,106,233,2,202,243,172,161,111,249,20,138,247,80,41,121,129,245,94,34,147,114,252,77,184])

            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({ uint8Array: secretKey }), message)
            const publicKey = new Uint8Array([46,135,102,118,84,123,132,242,106,233,2,202,243,172,161,111,249,20,138,247,80,41,121,129,245,94,34,147,114,252,77,184])

            const modifiedSignature = signature.asUint8Array()
            modifiedSignature[0] = 0

            assert(!SignatureVerifier.verify(new Uint8Array(message), modifiedSignature, new UInt256({ uint8Array: publicKey})))
        });
    });
});
