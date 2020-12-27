import UInt256 from '../src/lib/UInt256'
import * as assert from 'assert'
import MessageSigner from "../src/lib/MessageSigner";
import UInt512 from "../src/lib/UInt512";
import SignatureVerifier from "../src/lib/SignatureVerifier";
import Account from '../src/lib/Account'
import {Signature} from '../src/lib/Numbers'
const nacl = require('tweetnacl-blake2b')

// must be generated by nacl.sign.keyPair(), otherwise signing/verifying fails
const someSecretKeyUint8Array = new Uint8Array([127, 63, 106, 141, 25, 123, 43, 17, 51, 87, 244, 90, 139, 249, 202, 186, 57, 205, 155, 51, 151, 20, 164, 33, 16, 117, 133, 175, 27, 121, 103, 35, 48, 152, 42, 234, 23, 107, 217, 25, 171, 179, 48, 157, 23, 108, 219, 19, 89, 175, 157, 241, 28, 114, 125, 52, 141, 28, 128, 209, 242, 169, 88, 234])

describe('SignatureVerifier', () => {
    describe('#verify()', () => {
        it('should assert a valid signature from a random key pair', () => {
            const {secretKey, publicKey} = nacl.sign.keyPair()
            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({uint8Array: secretKey}), message)

            assert(SignatureVerifier.verify(message, signature, new UInt256({uint8Array: publicKey})))
        })

        it('should assert a valid signature from a static secret key', () => {
            const secretKeyUint8Array = someSecretKeyUint8Array
            const {publicKey} = nacl.sign.keyPair.fromSecretKey(secretKeyUint8Array)
            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({uint8Array: secretKeyUint8Array}), message)
            assert(SignatureVerifier.verify(
                message,
                signature,
                new UInt256({uint8Array: publicKey}))
            )
        })

        it('should assert a valid signature from a static seed', () => {
            const seed = new Uint8Array([46, 135, 102, 118, 84, 123, 132, 242, 106, 233, 2, 202, 243, 172, 161, 111, 249, 20, 138, 247, 80, 41, 121, 129, 245, 94, 34, 147, 114, 252, 77, 184])
            const {secretKey, publicKey} = nacl.sign.keyPair.fromSeed(seed)
            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({uint8Array: secretKey}), message)
            assert(SignatureVerifier.verify(message, signature, new UInt256({uint8Array: publicKey})))
        })

        it('should assert a valid blake signature', () => {
            const message = new UInt256().asBuffer()
            const signatureBuffer = Buffer.from('43E34B96F49CC820712A19D08D3E281B538A1982CA3880FDEAB35FE86B8931A3E7266AD4D91A66A62B2E5A1959545CCB6BC64EE693E28191CBB591A10929F30D', 'hex')
            const publicKey = Buffer.from('2CBC6476457EC9041882FB2608F13FD9383DE3ECE41E4544A38D515ED35886A8', 'hex') // nano_1d7weju6czpb1iea7ys835rmzpbr9qjyss1yao4c95cjduboj3oaj7weaxzw

            assert(SignatureVerifier.verify(message, new UInt512({buffer: signatureBuffer}), new UInt256({ buffer: publicKey})))
        })

        it('should not assert an invalid signature', () => {
            const secretKeyUint8Array = someSecretKeyUint8Array
            const message = Buffer.from('testing')
            const signature = MessageSigner.sign(new UInt512({ uint8Array: secretKeyUint8Array }), message)
            const {publicKey} = nacl.sign.keyPair.fromSecretKey(secretKeyUint8Array)

            assert(SignatureVerifier.verify(message, signature, new UInt256({ uint8Array: publicKey})))

            const modifiedSignatureUint8Array = signature.value.asUint8Array()
            modifiedSignatureUint8Array[0] = 0
            const modifiedSignature = new Signature(new UInt512({uint8Array: modifiedSignatureUint8Array}))

            assert(!SignatureVerifier.verify(message, modifiedSignature, new UInt256({ uint8Array: publicKey})))
        })
    })
})
