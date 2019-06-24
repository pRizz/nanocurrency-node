import {UnsignedInteger, UnsignedIntegerImpl, UnsignedIntegerProps} from './UnsignedInteger'

export default class UInt512 implements UnsignedInteger {
    private static readonly bitCount = 512
    private static readonly byteCount = UInt512.bitCount >>> 3

    private readonly unsignedIntegerImpl: UnsignedIntegerImpl

    constructor(props?: UnsignedIntegerProps) {
        this.unsignedIntegerImpl = new UnsignedIntegerImpl(this, props)
    }

    static getBitCount(): number {
        return UInt512.bitCount
    }

    static getByteCount(): number {
        return UInt512.byteCount
    }

    getBitCount(): number {
        return UInt512.bitCount
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
