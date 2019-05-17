import BlockHash from './BlockHash'
import UInt64 from './UInt64'
import Config from './Config'
const blakejs = require('blakejs')

function workValue(blockHash: BlockHash, work: UInt64): UInt64 {
    const hashContext = blakejs.blake2bInit(8)
    blakejs.blake2bUpdate(hashContext, work.asUint8Array())
    blakejs.blake2bUpdate(hashContext, blockHash.asUint8Array())
    return blakejs.blake2bFinal(hashContext)
}

export default function validate(blockHash: BlockHash, work: UInt64, difficulty: UInt64): boolean {
    const value = workValue(blockHash, work)

    return value.lessThan(Config.publishThreshold)
}
