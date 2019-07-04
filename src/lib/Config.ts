import UInt64 from './UInt64'

const publishTestThresholdHex = 'ff00000000000000'
const publishFullThresholdHex = 'ffffffc000000000'

export enum NANONetworks {
    nanoTestNetwork = 0,
    raiTestNetwork = 0,
    nanoBetaNetwork = 1,
    raiBetaNetwork = 1,
    nanoLiveNetwork = 2,
    raiLiveNetwork = 2,
}

export class NetworkConstants {
    static publishThresholdDifficulty = new UInt64({ hex: publishFullThresholdHex })

    static activeNetwork = NANONetworks.nanoLiveNetwork
    static activeNetworkToString(): string {
        if(NetworkConstants.activeNetwork === NANONetworks.nanoLiveNetwork) { return 'live' }
        if(NetworkConstants.activeNetwork === NANONetworks.nanoBetaNetwork) { return 'beta' }
        return 'test'
    }

    static isLiveNetwork(): boolean {
        switch (NetworkConstants.activeNetwork) {
            case NANONetworks.nanoLiveNetwork: return true
            case NANONetworks.nanoBetaNetwork: return false
            case NANONetworks.nanoTestNetwork: return false
        }
    }
}
