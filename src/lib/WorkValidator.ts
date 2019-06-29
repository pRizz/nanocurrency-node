import BlockHash from './BlockHash'
import UInt64 from './UInt64'
import Work from "./Work";
import {UncheckedInfo} from '../secure/Common'
import {NetworkConstants} from './Config'
const blakejs = require('blakejs')

// FIXME: might have to signify endianness
function getWorkValue(blockHash: BlockHash, work: Work): UInt64 {
    const hashContext = blakejs.blake2bInit(8)
    blakejs.blake2bUpdate(hashContext, work.value.asUint8Array().reverse())
    blakejs.blake2bUpdate(hashContext, blockHash.value.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new UInt64({ uint8Array: result })
}

namespace WorkValidator {
    export function isWorkValid(blockHash: BlockHash, work: Work): boolean {
        const workValue = getWorkValue(blockHash, work)
        return workValue.greaterThanOrEqualTo(NetworkConstants.publishThresholdDifficulty)
    }

    export function isUncheckedInfoValid(uncheckedInfo: UncheckedInfo) {
        return isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())
    }
}

export default WorkValidator
