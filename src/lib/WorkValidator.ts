import BlockHash from './BlockHash'
import UInt64 from './UInt64'
import Config from './Config'
const blakejs = require('blakejs')

// FIXME: might have to signify endianness
function getWorkValue(blockHash: BlockHash, work: UInt64): UInt64 {
    const hashContext = blakejs.blake2bInit(8)
    blakejs.blake2bUpdate(hashContext, work.asUint8Array().reverse())
    blakejs.blake2bUpdate(hashContext, blockHash.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new UInt64({ uint8Array: result })
}

namespace WorkValidator {
    export function isWorkValid(blockHash: BlockHash, work: UInt64): boolean {
        const workValue = getWorkValue(blockHash, work)
        return workValue.greaterThanOrEqualTo(Config.publishThresholdDifficulty)
    }
}

export default WorkValidator
