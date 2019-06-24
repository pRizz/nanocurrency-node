import UInt512 from "./UInt512"
import {Signature} from './Numbers'
const nacl = require('tweetnacl')

namespace MessageSigner {
    // FIXME: use blake2b as hashing for signing
    export function sign(secretKey: UInt512, message: Buffer): Signature {
        const signature = nacl.sign.detached(new Uint8Array(message), secretKey.asUint8Array())
        return new Signature(new UInt512({ uint8Array: signature }))
    }
}

export default MessageSigner
