import UInt256 from './UInt256'
import UInt64 from './UInt64'
import WorkValidator from './WorkValidator'
import BlockHash from "./BlockHash";

// TODO: optimize; use PowGeneratorWorkers
namespace PowGenerator {
    export function generate(hash: BlockHash): UInt64 {
        let validWorkUInt64

        do {
            validWorkUInt64 = UInt64.getRandom()
        } while (!WorkValidator.isWorkValid(hash, validWorkUInt64))

        return validWorkUInt64
    }
}

export default PowGenerator
