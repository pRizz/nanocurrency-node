import {UnsignedInteger, UnsignedIntegerImpl, UnsignedIntegerProps} from './UnsignedInteger'

const blakejs = require('blakejs')

export default class UInt128 implements UnsignedInteger {
    private static readonly bitCount = 128
    private static readonly byteCount = UInt128.bitCount >>> 3

    private readonly unsignedIntegerImpl: UnsignedIntegerImpl

    constructor(props: UnsignedIntegerProps) {
        this.unsignedIntegerImpl = new UnsignedIntegerImpl(this, props)
    }

    static getBitCount(): number {
        return UInt128.bitCount
    }

    static getByteCount(): number {
        return UInt128.byteCount
    }

    getBitCount(): number {
        return UInt128.bitCount
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
