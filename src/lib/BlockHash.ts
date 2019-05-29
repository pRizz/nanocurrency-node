import UInt256 from './UInt256'

export default class BlockHash {
    readonly value: UInt256

    constructor(hashValue: UInt256) {
        this.value = hashValue
    }
}
