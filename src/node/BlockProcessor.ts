import {ProcessReturn, SignatureVerification, UncheckedInfo} from "../secure/Common";
import Block, {BlockType} from "../lib/Block";
import {ReadTransaction, Transaction, WriteTransaction} from "../secure/BlockStore";
import {VoteGenerator} from "./Voting";
import {Duration, Moment} from "moment";
import Account from "../lib/Account";
import UInt256 from "../lib/UInt256";
import WorkValidator from "../lib/WorkValidator";
import BlockHash from "../lib/BlockHash";
import {SignatureChecker, SignatureVerifiable} from './Signatures'
import Constants from './Common'
import moment = require("moment")
import {QualifiedRoot} from '../lib/Numbers'

// TODO: implement
class RolledHashContainer {
    has(blockHash: BlockHash): boolean {
        throw 0 // FIXME
    }

    // returns success
    insert(rolledHash: RolledHash): boolean {
        throw 0 // FIXME
    }

    removeBlockHash(blockHash: BlockHash) {
        throw 0 // FIXME
    }

    removeRolledHash(rolledHash: RolledHash) {
        throw 0 // FIXME
    }

    getSize(): number {
        throw 0 // FIXME
    }

    getFirst(): RolledHash {
        throw 0 // FIXME
    }
}

// TODO: Optimize
class BlockHashSet {
    private set = new Set<string>()

    add(blockHash: BlockHash) {
        this.set.add(blockHash.toString())
    }

    has(blockHash: BlockHash): boolean {
        return this.set.has(blockHash.toString())
    }

    delete(blockHash: BlockHash) {
        this.set.delete(blockHash.toString())
    }
}

//TODO: implement
class RolledHash {
    readonly blockHash: BlockHash
    readonly timePoint: Moment

    constructor(blockHash: BlockHash, timePoint: Moment) {
        this.blockHash = blockHash
        this.timePoint = timePoint
    }
}

export interface BlockProcessorDelegate {
    txBeginRead(): ReadTransaction
    doesBlockExist(transaction: Transaction, blockType: BlockType, blockHash: BlockHash): boolean
    isEpochLink(link: UInt256): boolean
    getEpochSigner(): Account
    txBeginWrite(): WriteTransaction
    successorFrom(transaction: Transaction, qualifiedRoot: QualifiedRoot): Block | undefined
    rollback(transaction: Transaction, blockHash: BlockHash, rollbackList: Array<Block>): void
    removeRollbackList(rollbackList: Array<Block>): void
}

// FIXME: audit class and make unit tests
export default class BlockProcessor {
    static readonly rolledBackMax = 1024
    static readonly confirmationRequestDelay: Duration = moment.duration(500, 'ms')

    readonly blockHashSet = new BlockHashSet()
    readonly rolledBackHashes = new RolledHashContainer()
    readonly stateBlockInfos = new Array<UncheckedInfo>()
    readonly nonStateBlockInfos = new Array<UncheckedInfo>()
    readonly forcedBlocks = new Array<Block>()
    readonly isStopped = false

    private readonly delegate: BlockProcessorDelegate

    constructor(delegate: BlockProcessorDelegate) {
        this.delegate = delegate
    }

    stop() {

    }

    flush() {

    }

    isFull(): boolean {
        return false
    }

    add(uncheckedInfo: UncheckedInfo) {
        // TODO: Optimize; why not check the set first; checking if the work is valid is more expensive
        if(!WorkValidator.isUncheckedInfoValid(uncheckedInfo)) {
            // TODO: log invalid attempt
            return
        }

        const blockHash = uncheckedInfo.block.getHash()

        if(this.blockHashSet.has(blockHash)) {
            return
        }

        if(this.rolledBackHashes.has(blockHash)) {
            return
        }

        if(uncheckedInfo.signatureVerification === SignatureVerification.unknown &&
            (
                uncheckedInfo.block.getBlockType() === BlockType.state
                || uncheckedInfo.block.getBlockType() === BlockType.open
                || (uncheckedInfo.account && uncheckedInfo.account.isZero())
            )
        ) {
            this.stateBlockInfos.push(uncheckedInfo)
        } else {
            this.nonStateBlockInfos.push(uncheckedInfo)
        }
        this.blockHashSet.add(blockHash)
    }

    addBlock(block: Block, origination: Moment) {
        const uncheckedInfo = new UncheckedInfo({
            block,
            modified: origination,
            signatureVerification: SignatureVerification.unknown
        })
        this.add(uncheckedInfo)
    }

    force(block: Block) {

    }

    shouldLog(should: boolean): boolean {
        return false
    }

    haveBlocks(): boolean {
        return this.nonStateBlockInfos.length !== 0 || this.stateBlockInfos.length !== 0 || this.forcedBlocks.length !== 0
    }

    processBlocks() {
        while(!this.isStopped) {
            if(!this.haveBlocks()) {
                break
            }
            this.processBatch()
        }
    }

    private processBatch() {
        const maxVerificationBatchSize = 100 // FIXME: align with C++ project
        if(this.stateBlockInfos.length !== 0) {
            const readTransaction = this.delegate.txBeginRead()
            let stateBlockTimerDone = false
            setTimeout(() => { stateBlockTimerDone = true }, 2000)
            while(this.stateBlockInfos.length !== 0 && !stateBlockTimerDone) {
                this.verifyStateBlocks(readTransaction, maxVerificationBatchSize)
            }
        }

        const writeTransaction = this.delegate.txBeginWrite()

        let firstTime = true
        let processedBlockCount = 0
        let processedForcedBlockCount = 0

        let processingBlocksTimerDone = false
        setTimeout(() => { processingBlocksTimerDone = true }, 5000)

        while(
            (this.nonStateBlockInfos.length !== 0 || this.forcedBlocks.length !== 0)
            && (!processingBlocksTimerDone || processedBlockCount < Constants.blockProcessorBatchSize)
            ) {
            let uncheckedInfo: UncheckedInfo
            let force = false
            if(this.forcedBlocks.length === 0) {
                uncheckedInfo = this.nonStateBlockInfos.shift() as UncheckedInfo
                this.blockHashSet.delete(uncheckedInfo.block.getHash())
            } else {
                const firstForcedBlock = this.forcedBlocks.shift() as Block
                uncheckedInfo = new UncheckedInfo({
                    signatureVerification: SignatureVerification.unknown,
                    block: firstForcedBlock,
                    account: undefined,
                    modified: moment()
                })
                force = true
                ++processedForcedBlockCount
            }

            const hash = uncheckedInfo.block.getHash()
            if(force) {
                this.processForcedBatch(writeTransaction, uncheckedInfo, hash)
            }

            ++processedBlockCount
            this.processOne(writeTransaction, uncheckedInfo)

            if(this.nonStateBlockInfos.length === 0 && this.stateBlockInfos.length !== 0) {
                this.verifyStateBlocks(writeTransaction, 256) // FIXME batch size
            }
        }
    }

    private processForcedBatch(transaction: WriteTransaction, uncheckedInfo: UncheckedInfo, blockHash: BlockHash) {
        const successor = this.delegate.successorFrom(transaction, uncheckedInfo.block.getQualifiedRoot())
        if(!successor) {
            return
        }
        if(successor.getHash().equals(blockHash)) {
            return
        }

        const rollbackList = new Array<Block>()

        this.delegate.rollback(transaction, successor.getHash(), rollbackList)

        const successfulInsertion = this.rolledBackHashes.insert(new RolledHash(successor.getHash(), moment()))

        if(successfulInsertion) {
            this.rolledBackHashes.removeBlockHash(blockHash)
            if(this.rolledBackHashes.getSize() > BlockProcessor.rolledBackMax) {
                this.rolledBackHashes.removeRolledHash(this.rolledBackHashes.getFirst())
            }
        }

        this.delegate.removeRollbackList(rollbackList)
    }

    private verifyStateBlocks(transaction: Transaction, maxVerificationBatchSize: number) {
        const uncheckedInfos = new Array<UncheckedInfo>()

        for(let i = 0; i < maxVerificationBatchSize && this.stateBlockInfos.length !== 0; ++i) {
            const stateBlockInfo = this.stateBlockInfos.shift()
            if(!stateBlockInfo) {
                break
            }
            if(this.delegate.doesBlockExist(transaction, stateBlockInfo.block.getBlockType(), stateBlockInfo.block.getHash())) {
                continue
            }
            uncheckedInfos.push(stateBlockInfo)
        }

        const toVerify = this.uncheckedInfosToSignatureVerifiables(uncheckedInfos)
        const verifications = this.verifySignatureVerifiables(toVerify)

        for(const verification of verifications) {
            const uncheckedInfo = uncheckedInfos.shift()
            if(!uncheckedInfo) {
                break
            }
            const signatureVerification = this.signatureVerificationForUncheckedInfo(uncheckedInfo, verification)
            if(!signatureVerification) {
                continue
            }
            const updatedUncheckedInfo = new UncheckedInfo({
                block: uncheckedInfo.block,
                modified: uncheckedInfo.modified,
                account: uncheckedInfo.account,
                signatureVerification
            })
            this.nonStateBlockInfos.push(updatedUncheckedInfo)
        }
    }

    private signatureVerificationForUncheckedInfo(uncheckedInfo: UncheckedInfo, verification: boolean): SignatureVerification | null {
        let signatureVerification: SignatureVerification | null = null
        if(!uncheckedInfo.block.getLink().isZero() && this.delegate.isEpochLink(uncheckedInfo.block.getLink().value)) {
            //TODO: audit
            if(verification) {
                signatureVerification = SignatureVerification.valid_epoch
            } else {
                signatureVerification = SignatureVerification.unknown
            }
        } else if(verification) {
            signatureVerification = SignatureVerification.valid
        }

        return signatureVerification
    }

    private verifySignatureVerifiables(signatureVerifiables: Array<SignatureVerifiable>): Array<boolean> {
        return signatureVerifiables.map(SignatureChecker.verify)
    }

    private uncheckedInfosToSignatureVerifiables(uncheckedInfos: Array<UncheckedInfo>): Array<SignatureVerifiable> {
        return uncheckedInfos.map(this.uncheckedInfoToSignatureVerifiable.bind(this))
    }

    private uncheckedInfoToSignatureVerifiable(uncheckedInfo: UncheckedInfo): SignatureVerifiable {
        let account = uncheckedInfo.block.getAccount()
        if(!uncheckedInfo.block.getLink().isZero() && this.delegate.isEpochLink(uncheckedInfo.block.getLink().value)) {
            account = this.delegate.getEpochSigner()
        } else if(uncheckedInfo.account !== undefined && !uncheckedInfo.account.isZero()) {
            account = uncheckedInfo.account
        }

        let signatureVerifiable: SignatureVerifiable = {
            message: uncheckedInfo.block.getHash().value.asUint8Array(),
            signature: uncheckedInfo.block.getBlockSignature(),
            publicKey: account.publicKey
        }

        return signatureVerifiable
    }

    processOne(transaction: Transaction, uncheckedInfo: UncheckedInfo): ProcessReturn {
        return new ProcessReturn()
    }

    processOneBlock(transaction: Transaction, block: Block): ProcessReturn {
        return new ProcessReturn()
    }

    getVoteGenerator(): VoteGenerator {
        return new VoteGenerator()
    }
}
