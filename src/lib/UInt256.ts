export default class UInt256 {
    private static bitCount = 256
    private static byteCount = UInt256.bitCount / 8
    readonly value: Buffer = Buffer.alloc(UInt256.byteCount) // Big Endian
    private _isZero: boolean = null

    constructor(props: any) {
        if(!props) {
            return
        }

        if(props.hex) {
            this.value = Buffer.from(props.hex, 'hex')
            return
        }

        if(props.uint8Array) {
            if(props.uint8Array.length !== UInt256.byteCount) {
                throw 'Uint8Array is an invalid size'
            }
            this.value = Buffer.from(props.uint8Array)
            return
        }
    }

    asUint8Array(): Uint8Array {
        return new Uint8Array(this.value)
    }

    isZero(): boolean {
        if(this._isZero !== null) {
            return this._isZero
        }
        for(const byte of this.value) {
            if(byte !== 0) {
                return this._isZero = false
            }
        }
        return this._isZero = true
    }
}
