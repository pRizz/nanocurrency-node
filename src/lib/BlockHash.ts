import UInt256 from './UInt256'
import {MDBValueInterface} from '../node/LMDB'

// TODO: remove dependency on MDBValueInterface
export default class BlockHash implements MDBValueInterface<BlockHash> {
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

    getDBSize(): number {
        return UInt256.getByteCount()
    }

    asBuffer(): Buffer {
        return this.value.asBuffer()
    }

    static fromDBKeyBuffer(buffer: Buffer): BlockHash {
        return new BlockHash(new UInt256({buffer}))
    }
}
