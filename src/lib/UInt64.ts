import * as crypto from "crypto"
import {UnsignedInteger, UnsignedIntegerImpl, UnsignedIntegerProps} from './UnsignedInteger'

export default class UInt64 implements UnsignedInteger {
    private static readonly bitCount = 64
    private static readonly byteCount = UInt64.bitCount >>> 3

    private readonly unsignedIntegerImpl: UnsignedIntegerImpl

    constructor(props: UnsignedIntegerProps) {
        this.unsignedIntegerImpl = new UnsignedIntegerImpl(this, props)
    }

    static getBitCount(): number {
        return UInt64.bitCount
    }

    static getByteCount(): number {
        return UInt64.byteCount
    }

    getBitCount(): number {
        return UInt64.bitCount
    }

    static getRandom(): UInt64 {
        return new UInt64({ uint8Array: crypto.randomBytes(UInt64.byteCount) })
    }

    asUint8Array(): Uint8Array {
        return this.unsignedIntegerImpl.asUint8Array()
    }

    asBuffer(): Buffer {
        return this.unsignedIntegerImpl.asBuffer()
    }

    lessThan(other: UnsignedInteger): boolean {
        return this.unsignedIntegerImpl.lessThan(other)
    }

    greaterThanOrEqualTo(other: UnsignedInteger): boolean {
        return this.unsignedIntegerImpl.greaterThanOrEqualTo(other)
    }

    equals(other: UnsignedInteger): boolean {
        return this.unsignedIntegerImpl.equals(other)
    }

    isZero(): boolean {
        return this.unsignedIntegerImpl.isZero()
    }
}
