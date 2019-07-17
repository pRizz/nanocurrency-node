import UInt512 from './UInt512'
import UInt256 from './UInt256'
import {Equatable} from '../node/Common'

export class Signature implements Equatable<Signature> {
    constructor(readonly value: UInt512) {}

    equals(other: Signature): boolean {
        return this.value.equals(other.value)
    }
}

export class QualifiedRoot implements Equatable<QualifiedRoot> {
    constructor(readonly value: UInt512) {}

    equals(other: QualifiedRoot): boolean {
        return this.value.equals(other.value)
    }
}

export class PublicKey implements Equatable<PublicKey> {
    constructor(readonly value: UInt256) {}

    equals(other: PublicKey): boolean {
        return this.value.equals(other.value)
    }
}

export class RawKey implements Equatable<RawKey> {
    constructor(readonly value: UInt512) {}

    decrypt() {
        // TODO
    }

    equals(other: RawKey): boolean {
        return this.value.equals(other.value)
    }
}
