export interface UnsignedInteger {
    getBitCount(): number
    asUint8Array(): Uint8Array
    asBuffer(): Buffer
    equals(other: UnsignedInteger): boolean
    isZero(): boolean
    lessThan(other: UnsignedInteger): boolean
    greaterThanOrEqualTo(other: UnsignedInteger): boolean
}

export class UnsignedIntegerProps {
    hex?: string
    buffer?: Buffer
    uint8Array?: Uint8Array
    octetArray?: Array<number>
}

export class UnsignedIntegerImpl implements UnsignedInteger {
    private readonly bitCount: number
    private readonly byteCount: number
    private readonly buffer: Buffer // Big Endian
    private _isZero?: boolean

    constructor(unsignedInteger: UnsignedInteger, unsignedIntegerProps?: UnsignedIntegerProps) {
        this.bitCount = unsignedInteger.getBitCount()
        this.byteCount = this.bitCount / 8

        if(unsignedIntegerProps === undefined) {
            this.buffer = Buffer.alloc(this.byteCount)
            return
        }
        if(unsignedIntegerProps.hex) {
            this.buffer = Buffer.from(unsignedIntegerProps.hex, 'hex')
            return
        }
        if(unsignedIntegerProps.buffer) {
            if(unsignedIntegerProps.buffer.length !== this.byteCount) {
                throw `buffer prop is an invalid length. Expected ${this.byteCount} but was ${unsignedIntegerProps.buffer.length}`
            }
            this.buffer = Buffer.from(unsignedIntegerProps.buffer)
            return
        }
        if(unsignedIntegerProps.uint8Array) {
            if(unsignedIntegerProps.uint8Array.length !== this.byteCount) {
                throw `Uint8Array prop is an invalid length. Expected ${this.byteCount} but was ${unsignedIntegerProps.uint8Array.length}`
            }
            this.buffer = Buffer.from(unsignedIntegerProps.uint8Array)
            return
        }
        if(unsignedIntegerProps.octetArray) {
            if(unsignedIntegerProps.octetArray.length !== this.byteCount) {
                throw `octetArray prop is an invalid length. Expected ${this.byteCount} but was ${unsignedIntegerProps.octetArray.length}`
            }
            this.buffer = Buffer.from(unsignedIntegerProps.octetArray)
            return
        }
        this.buffer = Buffer.alloc(this.byteCount)
    }

    lessThan(other: UnsignedInteger): boolean {
        return this.asBuffer().compare(other.asBuffer()) === -1
    }

    greaterThanOrEqualTo(other: UnsignedInteger): boolean {
        return !this.lessThan(other)
    }

    equals(other: UnsignedInteger): boolean {
        return this.asBuffer().equals(other.asBuffer())
    }

    asUint8Array(): Uint8Array {
        return new Uint8Array(this.buffer)
    }

    asBuffer(): Buffer {
        return this.buffer
    }

    getBitCount(): number {
        return this.bitCount
    }

    isZero(): boolean {
        if(this._isZero !== undefined) {
            return this._isZero
        }
        const zeroBuffer = Buffer.alloc(this.byteCount)
        return this._isZero = this.asBuffer().equals(zeroBuffer)
    }
}

