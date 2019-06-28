import UInt256 from './UInt256'

export default class BlockHash {
    readonly value: UInt256

    constructor(hashValue: UInt256) {
        this.value = hashValue
    }

    isZero(): boolean {
        return this.value.isZero()
    }

    toString(): string {
        return this.value.asBuffer().toString('hex')
    }

    equals(other: BlockHash): boolean {
        return this.value.equals(other.value)
    }
}
