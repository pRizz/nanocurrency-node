import * as os from 'os'
import * as path from 'path'
import {NANONetwork, NetworkConstants} from '../lib/Config'

function getPathSuffix(isLegacy: boolean): string {
    switch (NetworkConstants.activeNetwork) {
        case NANONetwork.nanoLiveNetwork: return isLegacy ? 'RaiBlocks' : 'Nano'
        case NANONetwork.nanoBetaNetwork: return isLegacy ? 'RaiBlocksBeta' : 'NanoBeta'
        case NANONetwork.nanoTestNetwork: return isLegacy ? 'RaiBlocksTest' : 'NanoTest'
    }
}

namespace Utility {
    export function getWorkingPath(isLegacy: boolean): string {
        return path.join(os.homedir(), getPathSuffix(isLegacy))
    }
}

export default Utility
