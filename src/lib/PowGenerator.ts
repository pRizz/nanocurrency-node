import UInt64 from './UInt64'
import WorkValidator from './WorkValidator'
import BlockHash from "./BlockHash";
import Work from "./Work";

// TODO: optimize; use PowGeneratorWorkers
namespace PowGenerator {
    export function generate(hash: BlockHash): Work {
        let validWork

        do {
            validWork = new Work(UInt64.getRandom())
        } while (!WorkValidator.isWorkValid(hash, validWork))

        return validWork
    }
}

export default PowGenerator
