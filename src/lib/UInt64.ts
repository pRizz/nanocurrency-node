
export default class UInt64 {
    value: Buffer

    constructor(number: string) {
        //FIXME
        this.value = Buffer.from(number)
    }

    lessThan(other: UInt64): boolean {
        return this.value.compare(other.value) < 0 // FIXME
    }

    asUint8Array(): Uint8Array {
        return new Uint8Array(this.value)
    }
}
