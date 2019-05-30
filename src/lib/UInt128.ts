const blakejs = require('blakejs')

export default class UInt128 {
    private static bitCount = 128
    private static byteCount = UInt128.bitCount / 8
    readonly value: Buffer = Buffer.alloc(UInt128.byteCount) // Big Endian

    constructor(props: any) {
        if(!props) {
            return
        }

        if(props.hex) {
            this.value = Buffer.from(props.hex, 'hex')
            return
        }

        if(props.buffer) {
            if(props.buffer.length !== UInt128.byteCount) {
                throw 'Buffer is an invalid size'
            }
            this.value = Buffer.from(props.buffer)
            return
        }

        if(props.uint8Array) {
            if(props.uint8Array.length !== UInt128.byteCount) {
                throw 'Uint8Array is an invalid size'
            }
            this.value = Buffer.from(props.uint8Array)
            return
        }
    }

    asUint8Array(): Uint8Array {
        return new Uint8Array(this.value)
    }

    toString(): string {
        return this.value.toString('hex')
    }
}
