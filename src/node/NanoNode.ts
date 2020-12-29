import BlockProcessor, {BlockProcessorDelegate} from "./BlockProcessor";
import {BlockStoreInterface, ReadTransaction, Transaction, WriteTransaction} from "../secure/BlockStore";
import Ledger from "../secure/Ledger";
import Block, {BlockType} from '../lib/Block'
import BlockHash from '../lib/BlockHash'
import Account from '../lib/Account'
import UInt256 from '../lib/UInt256'
import {QualifiedRoot, Signature} from '../lib/Numbers'
import {VotesCache} from './Voting'
import {Wallets} from './Wallet'
import {Network} from './Network'
import {NodeConfig, NodeFlags} from './NodeConfig'
import {UDPChannelsDelegate} from './transport/UDP'
import {ChannelTCP, TCPChannelsDelegate} from './transport/TCP'
import {Endpoint, IPAddress, TCPEndpoint, UDPEndpoint} from './Common'
import {IPv6} from 'ipaddr.js'
import UInt512 from '../lib/UInt512'
import RepCrawler, {RepCrawlerDelegate} from './RepCrawler'
import {MDBStore} from './LMDB'
import * as path from 'path'
import {BootstrapInitiator, BootstrapInitiatorDelegate, BootstrapListener, BootstrapListenerDelegate} from './Bootstrap'
import {PortMapping, PortMappingDelegate} from './PortMapping'
import {VoteProcessor, VoteProcessorDelegate} from './VoteProcessor'
import {ConfirmationHeightProcessor} from './ConfirmationHeightProcessor'
import {ActiveTransactions} from './ActiveTransactions'
import * as NANOWebSocket from './WebSocket'
import {SignatureChecker} from './Signatures'
import {Stat} from '../lib/Stats'
import {WriteDatabaseQueue} from './WriteDatabaseQueue'
import {NANONetwork, NetworkConstants} from '../lib/Config'
import moment = require('moment')
import {SyncService} from './SyncService'
import {SQLiteBlockStore} from './blockStore/SQLiteBlockStore'

class BlockArrival {
    add(block: Block): boolean {
        return false // TODO
    }
}

export default class NanoNode implements BlockProcessorDelegate, UDPChannelsDelegate, TCPChannelsDelegate, BootstrapListenerDelegate, PortMappingDelegate, VoteProcessorDelegate, NANOWebSocket.default.ListenerDelegate, BootstrapInitiatorDelegate, RepCrawlerDelegate {
    private readonly blockProcessor: BlockProcessor
    private readonly ledger: Ledger
    private readonly blockArrival = new BlockArrival()
    private readonly votesCache = new VotesCache()
    private readonly wallets = new Wallets() // FIXME: Doesn't really belong in the core node
    private readonly activeTransactions = new ActiveTransactions()
    private readonly network: Network
    private readonly repCrawler = new RepCrawler(this)
    private readonly bootstrapListener: BootstrapListener
    private readonly portMapping: PortMapping
    private readonly voteProcessor: VoteProcessor
    private readonly confirmationHeightProcessor: ConfirmationHeightProcessor
    private isStopped = false
    private readonly webSocketServer: NANOWebSocket.default.Listener | undefined
    private readonly bootstrapInitiator: BootstrapInitiator
    private readonly signatureChecker: SignatureChecker
    private readonly stats: Stat
    private readonly writeDatabaseQueue = new WriteDatabaseQueue()
    private readonly syncService: SyncService

    static async create(applicationPath: string, flags: NodeFlags = new NodeFlags(), nodeConfig: NodeConfig): Promise<NanoNode> {
        const blockStore = await SQLiteBlockStore.from({})
        return new NanoNode(applicationPath, flags, blockStore, nodeConfig)
    }

    private constructor(
        readonly applicationPath: string,
        private readonly flags: NodeFlags = new NodeFlags(),
        private readonly blockStore: BlockStoreInterface,
        private readonly nodeConfig: NodeConfig
    ) {
        if(this.nodeConfig.webSocketConfig.getIsEnabled()) {
            const endpoint = new TCPEndpoint(new IPAddress(this.nodeConfig.webSocketConfig.getIPAddress()), this.nodeConfig.webSocketConfig.getPort())
            this.webSocketServer = new NANOWebSocket.default.Listener(this, endpoint)
            this.webSocketServer.run()
        }

        this.blockProcessor = new BlockProcessor(this)
        this.ledger = new Ledger(this.blockStore)

        this.applicationPath = applicationPath

        this.network = new Network(flags.disableUDP, this.nodeConfig.peeringPort, this, this)

        this.bootstrapListener = new BootstrapListener(this.nodeConfig.peeringPort, this)

        this.portMapping = new PortMapping(this)
        this.voteProcessor = new VoteProcessor(this)
        this.confirmationHeightProcessor = new ConfirmationHeightProcessor()
        this.bootstrapInitiator = new BootstrapInitiator(this)
        this.signatureChecker = new SignatureChecker(nodeConfig.signatureCheckerThreads)
    }

    async start(): Promise<void> {
        await this.network.start()
        this.addInitialPeers()

        if(!this.flags.disableLegacyBootstrap) {
            this.ongoingBootstrap()
        } else if(!this.flags.disableUncheckedCleanup) {
            this.ongoingUncheckedCleanup()
        }

        this.ongoingStoreFlush()
        this.repCrawler.start()
        this.ongoingRepCalculation()
        this.ongoingPeerStore()
        this.ongoingOnlineWeightCalculationQueue()

        if(this.nodeConfig.tcpIncomingConnectionsMax > 0) {
            this.bootstrapListener.start()
        }

        if(!this.flags.disableBackup) {
            this.backupWallet()
        }

        this.searchPending()

        if(!this.flags.disableWalletBootstrap) {
            setTimeout(() => {
                this.bootstrapWallet()
            }, moment.duration(1, 'minute').asMilliseconds())
        }

        if(this.nodeConfig.externalAddress.range() !== 'unspecified' && this.nodeConfig.externalPort !== 0) {
            this.portMapping.start()
        }

    }

    stop() {
        if(this.isStopped) {
            return
        }

        console.log(`${new Date().toISOString()}: Node stopping`)

        this.blockProcessor.stop()
        this.voteProcessor.stop()
        this.confirmationHeightProcessor.stop()
        this.activeTransactions.stop()
        this.network.stop()
        if(this.webSocketServer) {
            this.webSocketServer.stop()
        }

        this.bootstrapInitiator.stop()
        this.bootstrapListener.stop()
        this.portMapping.stop()
        this.signatureChecker.stop()
        this.wallets.stop()
        this.stats.stop()
        this.writeDatabaseQueue.stop()
    }

    isTestNetwork(): boolean {
        return NetworkConstants.activeNetwork === NANONetwork.nanoTestNetwork
    }

    blockRandom(readTransaction: ReadTransaction): Block {
        return this.blockStore.blockRandom(readTransaction)
    }

    private bootstrapWallet() {
        throw 0 // FIXME
    }

    private searchPending() {
        throw 0 // FIXME
    }

    private backupWallet() {
        throw 0 // FIXME
    }

    private ongoingOnlineWeightCalculationQueue() {
        throw 0 // FIXME
    }

    private ongoingPeerStore() {
        throw 0 // FIXME
    }

    private ongoingRepCalculation() {
        throw 0 // FIXME
    }

    private ongoingStoreFlush() {
        throw 0 // FIXME
    }

    private ongoingBootstrap() {
        throw 0 // FIXME
    }

    private ongoingUncheckedCleanup() {
        throw 0 // FIXME
    }

    private addInitialPeers() {
        const transaction = this.blockStore.txBeginRead()
        for(
            let peerIterator = this.blockStore.getPeersBegin(transaction), endIterator = this.blockStore.getPeersEnd();
            !peerIterator.equals(endIterator);
            peerIterator.next()
        ) {
            const peer = peerIterator.getCurrentKey()
            if(peer === undefined) {
                continue
            }
            if(this.network.hasReachoutError(peer, this.nodeConfig.allowLocalPeers)) {
                continue
            }
            this.network.tcpChannels.startTCPConnection(peer, (channel) => {
                this.network.sendKeepalive(channel)
                this.repCrawler.query(channel)
            }).catch()
        }
    }

    getRandomPeers(): Set<UDPEndpoint> {
        throw 0 // FIXME
    }

    getUDPChannelCount(): number {
        return this.network.udpChannels.getChannelCount()
    }

    bootstrapPeer(protocolVersionMin: number): TCPEndpoint {
        throw 0 // FIXME
        return new TCPEndpoint(new IPAddress(IPv6.parse('')), 0)
    }

    startTCPReceiveNodeID(channel: ChannelTCP, endpoint: Endpoint, receiveBuffer: Buffer, callback: () => void): void {
        throw 0 // FIXME
    }

    tcpSocketConnectionFailed(): void {
        throw 0 // FIXME
    }

    getAccountCookieForEndpoint(endpoint: Endpoint): Account {
        throw 0 // FIXME
    }

    isNodeValid(endpoint: TCPEndpoint, nodeID: Account, signature: Signature): boolean {
        throw 0 // FIXME
    }

    getNodeID(): Account {
        throw 0 // FIXME
    }

    hasNode(nodeID: Account): boolean {
        throw 0 // FIXME
    }

    hasPeer(endpoint: UDPEndpoint | undefined, allowLocalPeers: boolean): boolean {
        throw 0 // FIXME
    }

    getPrivateKey(): UInt512 {
        throw 0 // FIXME
    }

    isLocalPeersAllowed(): boolean {
        return this.nodeConfig.allowLocalPeers
    }

    processBlock(block: Block) {
        this.blockArrival.add(block)
        this.blockProcessor.addBlock(block, moment())
    }

    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean {
        return this.ledger.blockStore.doesBlockExist(transaction, blockType, blockHash)
    }

    getEpochSigner(): Account {
        return this.ledger.getEpochSigner()
    }

    isEpochLink(link: UInt256): boolean {
        return this.ledger.isEpochLink(link)
    }

    txBeginRead(): ReadTransaction {
        return this.blockStore.txBeginRead()
    }

    txBeginWrite(): WriteTransaction {
        return this.blockStore.txBeginWrite()
    }

    successorFrom(transaction: Transaction, qualifiedRoot: QualifiedRoot): Block | undefined {
        return this.ledger.successorFrom(transaction, qualifiedRoot)
    }

    rollback(transaction: Transaction, blockHash: BlockHash, rollbackList: Array<Block>) {
        this.ledger.rollback(transaction, blockHash, rollbackList)
    }

    removeRollbackList(rollbackList: Array<Block>): void {
        for(const block of rollbackList) {
            this.votesCache.remove(block.getHash())
            this.wallets.workWatcher.remove(block)
            this.activeTransactions.erase(block)
        }
    }
}
