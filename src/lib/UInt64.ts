import * as crypto from "crypto"

export default class UInt64 {
    private static bitCount = 64
    private static byteCount = UInt64.bitCount / 8

    readonly value: Buffer = Buffer.alloc(UInt64.byteCount) // Big Endian

    constructor(props: any) {
        if(!props) {
            this.value = Buffer.alloc(UInt64.byteCount)
            return
        }
        if(props.hex) {
            this.value = Buffer.from(props.hex, 'hex')
            return
        }
        if(props.uint8Array) {
            if(props.uint8Array.length !== UInt64.byteCount) {
                throw 'Uint8Array is an invalid size'
            }
            this.value = Buffer.from(props.uint8Array)
            return
        }
    }

    static getRandom(): UInt64 {
        return new UInt64({ uint8Array: crypto.randomBytes(8) })
    }

    lessThan(other: UInt64): boolean {
        return this.value.compare(other.value) === -1
    }

    greaterThanOrEqualTo(other: UInt64): boolean {
        return !this.lessThan(other)
    }

    asUint8Array(): Uint8Array {
        return new Uint8Array(this.value)
    }
}
