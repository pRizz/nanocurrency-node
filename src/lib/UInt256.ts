import {UnsignedInteger, UnsignedIntegerImpl, UnsignedIntegerProps} from './UnsignedInteger'

export default class UInt256 implements UnsignedInteger {
    private static readonly bitCount = 256
    private static readonly byteCount = UInt256.bitCount >>> 3

    private readonly unsignedIntegerImpl: UnsignedIntegerImpl

    constructor(props?: UnsignedIntegerProps) {
        this.unsignedIntegerImpl = new UnsignedIntegerImpl(this, props)
    }

    static getBitCount(): number {
        return UInt256.bitCount
    }

    static getByteCount(): number {
        return UInt256.byteCount
    }

    getBitCount(): number {
        return UInt256.bitCount
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
