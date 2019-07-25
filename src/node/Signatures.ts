import UInt256 from '../lib/UInt256'
import SignatureVerifier from '../lib/SignatureVerifier'
import UInt512 from '../lib/UInt512'

export interface NanoSignature {
    value: UInt512
}

export interface SignatureVerifiable {
    message: Uint8Array
    signature: NanoSignature
    publicKey: UInt256
}

export class SignatureChecker {
    static verify(signatureVerifiable: SignatureVerifiable): boolean {
        return SignatureVerifier.verify(signatureVerifiable.message, signatureVerifiable.signature.value.asUint8Array(), signatureVerifiable.publicKey)
    }

    constructor(private readonly signatureCheckerThreads: number) {}

    stop() {
        throw 0 // FIXME
    }
}
