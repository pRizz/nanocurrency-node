
export default class UInt64 {
    value: Buffer = Buffer.alloc(8) // Big Endian

    constructor(props: any) {
        if(!props) {
            this.value = Buffer.alloc(8)
            return
        }
        if(props.hex) {
            this.value = Buffer.from(props.hex, 'hex')
            return
        }
        if(props.uint8Array) {
            this.value = Buffer.from(props.uint8Array)
            return
        }
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
