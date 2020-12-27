import UInt256 from "./UInt256";
import * as nacl from "tweetnacl-blake2b";
import UInt512 from './UInt512'
import {Signature} from './Numbers'

namespace SignatureVerifier {
    export function verify(message: Uint8Array | Buffer, signature: UInt512 | Signature, publicKey: UInt256): boolean {
        if(signature instanceof Signature) {
            signature = signature.value
        }
        return nacl.sign.detached.verify(message, signature.asUint8Array(), publicKey.asUint8Array())
    }
}

export default SignatureVerifier
