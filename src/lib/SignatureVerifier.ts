import UInt256 from "./UInt256";
import * as nacl from "tweetnacl";

namespace SignatureVerifier {
    export function verify(message: Uint8Array, signature: Uint8Array, publicKey: UInt256): boolean {
        return nacl.sign.detached.verify(message, signature, publicKey.asUint8Array())
    }
}

export default SignatureVerifier
