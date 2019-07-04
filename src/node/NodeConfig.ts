import {NetworkConstants} from '../lib/Config'

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
    allowLocalPeers = !NetworkConstants.isLiveNetwork()
    peeringPort = 0
}
