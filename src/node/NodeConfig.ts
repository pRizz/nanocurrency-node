import {NANONetwork, NetworkConstants} from '../lib/Config'
import {DiagnosticsConfig} from './DiagnosticsConfig'
import * as moment from 'moment'
import {LedgerConstants, NetworkParams} from '../secure/Common'
import Account from '../lib/Account'
import UInt256 from '../lib/UInt256'
import ipaddr = require('ipaddr.js');
import NANOWebSocket from './WebSocketConfig'

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
    private static readonly preconfiguredBetaRepresentativePublicKeyStrings = [
        'A59A47CC4F593E75AE9AD653FDA9358E2F7898D9ACC8C60E80D0495CE20FBA9F',
        '259A4011E6CAD1069A97C02C3C1F2AAA32BC093C8D82EE1334F937A4BE803071',
        '259A40656144FAA16D2A8516F7BE9C74A63C6CA399960EDB747D144ABB0F7ABD',
        '259A40A92FA42E2240805DE8618EC4627F0BA41937160B4CFF7F5335FD1933DF',
        '259A40FF3262E273EC451E873C4CDF8513330425B38860D882A16BCC74DA9B73'
    ]

    private static readonly preconfiguredBetaRepresentatives = NodeConfig.preconfiguredBetaRepresentativePublicKeyStrings.map(Account.fromPublicKeyHex)

    private static readonly preconfiguredLiveRepresentativePublicKeyStrings = [
        'A30E0A32ED41C8607AA9212843392E853FCBCB4E7CB194E35C94F07F91DE59EF',
        '67556D31DDFC2A440BF6147501449B4CB9572278D034EE686A6BEE29851681DF',
        '5C2FBB148E006A8E8BA7A75DD86C9FE00C83F5FFDBFD76EAA09531071436B6AF',
        'AE7AC63990DAAAF2A69BF11C913B928844BF5012355456F2F164166464024B29',
        'BD6267D6ECD8038327D2BCC0850BDF8F56EC0414912207E81BCF90DFAC8A4AAA',
        '2399A083C600AA0572F5E36247D978FCFC840405F8D4B6D33161C0066A55F431',
        '2298FAB7C61058E77EA554CB93EDEEDA0692CBFCC540AB213B2836B29029E23A',
        '3FE80B4BC842E82C1C18ABFEEC47EA989E63953BC82AC411F304D13833D52A56'
    ]

    private static readonly preconfiguredLiveRepresentatives = NodeConfig.preconfiguredLiveRepresentativePublicKeyStrings.map(Account.fromPublicKeyHex)

    readonly allowLocalPeers = !NetworkConstants.isLiveNetwork()
    readonly maxDBs = 128
    readonly diagnosticsConfig: DiagnosticsConfig = new DiagnosticsConfig()
    readonly blockProcessorBatchMaxTime = moment.duration('5000', 'ms')
    readonly enableVoting: boolean = false
    readonly preconfiguredRepresentatives = new Array<Account>()
    readonly preconfiguredPeers = new Array<string>()
    readonly networkParams = new NetworkParams()
    readonly epochBlockLink: UInt256
    readonly epochBlockSigner: Account
    readonly tcpIncomingConnectionsMax = 1024
    readonly externalAddress = ipaddr.IPv6.parse('::')
    readonly externalPort = 0
    readonly webSocketConfig = new NANOWebSocket.Config()

    constructor(readonly peeringPort: number = 0) {
        if(this.peeringPort === 0) {
            this.peeringPort = NetworkParams.network.getDefaultNodePort()
        }

        const epochMessage = 'epoch v1 block'
        const epochBlockLinkBuffer = Buffer.alloc(32)
        epochBlockLinkBuffer.write(epochMessage)
        this.epochBlockLink = new UInt256({ buffer: epochBlockLinkBuffer })
        this.epochBlockSigner = this.networkParams.ledgerConstants.genesisAccount

        switch (NetworkParams.network.currentNetwork) {
            case NANONetwork.nanoTestNetwork:
                this.enableVoting = true
                this.preconfiguredRepresentatives.push(this.networkParams.ledgerConstants.genesisAccount)
                break
            case NANONetwork.nanoBetaNetwork:
                this.preconfiguredPeers.push(NodeConfigConstants.defaultBetaPeerNetwork)
                this.preconfiguredRepresentatives.push(...NodeConfig.preconfiguredBetaRepresentatives)
                break
            case NANONetwork.nanoLiveNetwork:
                this.preconfiguredPeers.push(NodeConfigConstants.defaultLivePeerNetwork)
                this.preconfiguredRepresentatives.push(...NodeConfig.preconfiguredLiveRepresentatives)
                break
        }
    }
}
