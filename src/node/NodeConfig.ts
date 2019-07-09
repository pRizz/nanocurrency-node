import {NetworkConstants} from '../lib/Config'
import {DiagnosticsConfig} from './DiagnosticsConfig'
import * as moment from 'moment'

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
    readonly peeringPort = 0
    readonly maxDBs = 128
    readonly diagnosticsConfig: DiagnosticsConfig = new DiagnosticsConfig()
    readonly blockProcessorBatchMaxTime = moment.duration('5000', 'ms')
}
