import {NANONetwork, NetworkConstants} from '../lib/Config'
import {DiagnosticsConfig} from './DiagnosticsConfig'
import * as moment from 'moment'
import {LedgerConstants, NetworkParams} from '../secure/Common'
import Account from '../lib/Account'

namespace NodeConfigConstants {
    export const preconfiguredPeersKey = 'preconfigured_peers'
    export const signatureCheckerThreadsKey = 'signature_checker_threads'
    export const powSleepIntervalKey = 'pow_sleep_interval'
    export const defaultBetaPeerNetwork = 'peering-beta.nano.org'
    export const defaultLivePeerNetwork = 'peering.nano.org'
}

export class NodeFlags {
    disableBackup = false
    disableLazyBoostrap = false
    disableLegacyBootstrap = false
    disableWalletBootstrap = false
    disableBoostrapListener = false
    disableTCPRealtime = false
    disableUDP = false
    disableUncheckedCleanup = false
    disableUncheckedDrop = true
    fastBootstrap = false
    delayConfirmationHeightUpdating = false
    sidebandBatchSize = 512
    blockProcessorBatchSize = 0
    blockProcessorFullSize = 65536
    blockProcessorVerificationSize = 0
}

export class NodeConfig {
    readonly allowLocalPeers = !NetworkConstants.isLiveNetwork()
    readonly maxDBs = 128
    readonly diagnosticsConfig: DiagnosticsConfig = new DiagnosticsConfig()
    readonly blockProcessorBatchMaxTime = moment.duration('5000', 'ms')
    readonly enableVoting: boolean = false
    readonly preconfiguredRepresentatives = new Array<Account>()
    readonly networkParams = new NetworkParams()

    constructor(readonly peeringPort: number = 0) {
        if(this.peeringPort === 0) {
            this.peeringPort = NetworkParams.network.getDefaultNodePort()
        }

        switch (NetworkParams.network.currentNetwork) {
            case NANONetwork.nanoTestNetwork:
                this.enableVoting = true
                this.preconfiguredRepresentatives.push(this.networkParams.ledgerConstants.genesisAccount)
                break
            case NANONetwork.nanoBetaNetwork:
                // TODO
            case NANONetwork.nanoLiveNetwork:
                // TODO
        }
    }
}
