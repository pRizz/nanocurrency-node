import UInt512 from "./UInt512"
const nacl = require('tweetnacl')

namespace MessageSigner {
    export function sign(secretKey: UInt512, message: Buffer): UInt512 {
        const signature = nacl.sign.detached(new Uint8Array(message), secretKey.asUint8Array())
        return new UInt512({ uint8Array: signature })
    }
}

export default MessageSigner
