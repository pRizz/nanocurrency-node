import {ProcessReturn, SignatureVerification, UncheckedInfo} from "../secure/Common";
import UInt64 from "../lib/UInt64";
import Block, {BlockType} from "../lib/Block";
import {ReadTransaction, Transaction} from "../secure/BlockStore";
import {VoteGenerator} from "./Voting";
import {Duration} from "moment";
import Account from "../lib/Account";
import UInt256 from "../lib/UInt256";
import WorkValidator from "../lib/WorkValidator";
import BlockHash from "../lib/BlockHash";
import NanoNode from "./NanoNode";
import {SignatureChecker, SignatureVerifiable} from './Signatures'
import moment = require("moment")

// TODO: implement
class RolledHashContainer {
    has(blockHash: BlockHash): boolean {
        return false
    }
}

// TODO: Optimize
class BlockHashSet {
    private set = new Set<string>()

    add(blockHash: BlockHash) {
        this.set.add(blockHash.value.value.toString('hex'))
    }

    has(blockHash: BlockHash): boolean {
        return this.set.has(blockHash.value.value.toString('hex'))
    }
}

//TODO: implement
class RolledHash {
    blockHash: BlockHash
    // timePoint
}

// FIXME: audit class and make unit tests
export default class BlockProcessor {
    static readonly rolledBackMax = 1024
    static readonly confirmationRequestDelay: Duration = moment.duration(500, 'ms')

    readonly blockHashSet = new BlockHashSet()
    readonly rolledBackHashes = new RolledHashContainer()
    readonly stateBlocks = new Array<UncheckedInfo>()
    readonly nonStateBlocks = new Array<UncheckedInfo>()
    readonly isStopped = false

    // FIXME: creates circular dependency
    private readonly nanoNode: NanoNode

    constructor(nanoNode: NanoNode) {
        this.nanoNode = nanoNode
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
        if(!WorkValidator.isWorkValid(uncheckedInfo.block.getHash(), uncheckedInfo.block.getWork())) {
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
                uncheckedInfo.block.getBlockType() === BlockType.state ||
                    uncheckedInfo.block.getBlockType() === BlockType.open ||
                    !uncheckedInfo.account.isZero()
            )
        ) {
            this.stateBlocks.push(uncheckedInfo)
        } else {
            this.nonStateBlocks.push(uncheckedInfo)
        }
        this.blockHashSet.add(blockHash)
    }

    addBlock(block: Block, origination: UInt64) {
        const uncheckedInfo = new UncheckedInfo({
            block,
            account: new Account(new UInt256(null)), // FIXME: seems dirty
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
        return false
    }

    processBlocks() {
        if(this.isStopped) {
            return
        }
        this.processBatch()
    }

    private processBatch() {
        const maxVerificationBatchSize = 100 // FIXME: align with C++ project
        if(this.stateBlocks.length === 0) {
            return
        }
        const readTransaction = this.nanoNode.blockStore.txBeginRead()
        let stateBlockTimerDone = false
        setTimeout(() => { stateBlockTimerDone = true }, 2000)
        while(this.stateBlocks.length !== 0 && !stateBlockTimerDone) {
            this.verifyStateBlocks(readTransaction, maxVerificationBatchSize)
        }
    }

    private verifyStateBlocks(readTransaction: ReadTransaction, maxVerificationBatchSize: number) {
        const uncheckedInfos = new Array<UncheckedInfo>()

        for(let i = 0; i < maxVerificationBatchSize && this.stateBlocks.length !== 0; ++i) {
            const stateBlockInfo = this.stateBlocks.shift()
            if(this.nanoNode.ledger.blockStore.doesBlockExist(readTransaction, stateBlockInfo.block.getBlockType(), stateBlockInfo.block.getHash())) {
                continue
            }
            uncheckedInfos.push(stateBlockInfo)
        }

        const toVerify = this.uncheckedInfosToSignatureVerifiables(uncheckedInfos)
        const verifications = this.verifySignatureVerifiables(toVerify)

        for(const verification of verifications) {
            const uncheckedInfo = uncheckedInfos.shift()
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
            this.nonStateBlocks.push(updatedUncheckedInfo)
        }
    }

    private signatureVerificationForUncheckedInfo(uncheckedInfo: UncheckedInfo, verification: boolean): SignatureVerification | null {
        let signatureVerification: SignatureVerification | null
        if(!uncheckedInfo.block.getLink().isZero() && this.nanoNode.ledger.isEpochLink(uncheckedInfo.block.getLink().value)) {
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
        if(!uncheckedInfo.block.getLink().isZero() && this.nanoNode.ledger.isEpochLink(uncheckedInfo.block.getLink().value)) {
            account = this.nanoNode.ledger.getEpochSigner()
        } else if(!uncheckedInfo.account.isZero()) {
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
