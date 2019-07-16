import UInt64 from './UInt64'

const publishTestThresholdHex = 'ff00000000000000'
const publishFullThresholdHex = 'ffffffc000000000'

export enum NANONetwork {
    nanoTestNetwork = 0,
    raiTestNetwork = 0,
    nanoBetaNetwork = 1,
    raiBetaNetwork = 1,
    nanoLiveNetwork = 2,
    raiLiveNetwork = 2,
}

export class NetworkConstants {
    static publishThresholdDifficulty = new UInt64({ hex: publishFullThresholdHex })

    static activeNetwork = NANONetwork.nanoLiveNetwork

    static activeNetworkToString(): string {
        if(NetworkConstants.activeNetwork === NANONetwork.nanoLiveNetwork) { return 'live' }
        if(NetworkConstants.activeNetwork === NANONetwork.nanoBetaNetwork) { return 'beta' }
        return 'test'
    }

    static isLiveNetwork(): boolean {
        switch (NetworkConstants.activeNetwork) {
            case NANONetwork.nanoLiveNetwork: return true
            case NANONetwork.nanoBetaNetwork: return false
            case NANONetwork.nanoTestNetwork: return false
        }
    }

    constructor(public currentNetwork: NANONetwork = NetworkConstants.activeNetwork) {}

    getDefaultNodePort(): number {
        return this.isLiveNetwork() ? 7075 : this.isBetaNetwork () ? 54000 : 44000
    }

    private isLiveNetwork(): boolean {
        return this.currentNetwork === NANONetwork.nanoLiveNetwork
    }

    private isBetaNetwork(): boolean {
        return this.currentNetwork === NANONetwork.nanoBetaNetwork
    }
}
