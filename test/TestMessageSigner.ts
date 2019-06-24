import * as assert from 'assert'
import MessageSigner from "../src/lib/MessageSigner";
import UInt512 from "../src/lib/UInt512";

describe('MessageSigner', () => {
    describe('#sign()', () => {
        it('should produce a signature', () => {
            const secretKey = new Uint8Array([131,242,95,55,29,48,155,172,182,222,93,66,21,222,241,157,69,61,132,180,33,110,120,4,192,91,166,133,118,197,45,119,46,135,102,118,84,123,132,242,106,233,2,202,243,172,161,111,249,20,138,247,80,41,121,129,245,94,34,147,114,252,77,184])
            const message = Buffer.from('hello world!', 'hex')
            const signature = MessageSigner.sign(new UInt512({ uint8Array: secretKey }), message)
            const expectedSignature = 'bc6109eba9ba358071e7cdf455df6f27b6be072696e897c80923d9895171343966c5dd5a53c223987c6ce494a758e43e0ee43991bcf341d3f670b08cb5cf3900'
            assert.strictEqual(signature.value.asBuffer().toString('hex'), expectedSignature)
        });
    });
});
