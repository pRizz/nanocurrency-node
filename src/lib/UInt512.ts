const blakejs = require('blakejs')

export default class UInt512 {
    private static bitCount = 512
    private static byteCount = UInt512.bitCount / 8
    readonly value: Buffer = Buffer.alloc(UInt512.byteCount) // Big Endian

    constructor(props: any) {
        if(!props) {
            return
        }

        if(props.hex) {
            this.value = Buffer.from(props.hex, 'hex')
            return
        }

        if(props.buffer) {
            if(props.buffer.length !== UInt512.byteCount) {
                throw 'Buffer is an invalid size'
            }
            this.value = Buffer.from(props.buffer)
            return
        }

        if(props.uint8Array) {
            if(props.uint8Array.length !== UInt512.byteCount) {
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
