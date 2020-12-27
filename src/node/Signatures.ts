import UInt256 from '../lib/UInt256'
import SignatureVerifier from '../lib/SignatureVerifier'
import UInt512 from '../lib/UInt512'
import {NodeIDHandshakeMessageResponse} from './Common'
import {Signature} from '../lib/Numbers'

export interface SignatureVerifiable {
    message: Uint8Array
    signature: Signature
    publicKey: UInt256
}

export class SignatureChecker {
    static verify(signatureVerifiable: SignatureVerifiable): boolean {
        return SignatureVerifier.verify(signatureVerifiable.message, signatureVerifiable.signature.value.asUint8Array(), signatureVerifiable.publicKey)
    }

    static verifyHandshakeResponse(sentChallengeQuery: UInt256, handshakeResponse: NodeIDHandshakeMessageResponse): boolean {
        return this.verify({
            message: sentChallengeQuery.asUint8Array(),
            signature: handshakeResponse.signature,
            publicKey: handshakeResponse.account.publicKey
        })
    }

    constructor(private readonly signatureCheckerThreads: number) {}

    stop() {
        throw 0 // FIXME
    }
}
