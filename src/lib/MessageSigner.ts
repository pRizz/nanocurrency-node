import UInt512 from "./UInt512"
import {Signature} from './Numbers'
import UInt256 from './UInt256'
const nacl = require('tweetnacl-blake2b')

namespace MessageSigner {
    // FIXME: use blake2b as hashing for signing
    export function sign(secretKey: UInt512, message: Buffer): Signature {
        const signature = nacl.sign.detached(new Uint8Array(message), secretKey.asUint8Array())
        return new Signature(new UInt512({ uint8Array: signature }))
    }
}

export default MessageSigner
