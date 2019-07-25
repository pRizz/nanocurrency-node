import Transport from './transport/Transport'
import {ReadTransaction} from '../secure/BlockStore'
import Block from '../lib/Block'
import BlockHash from '../lib/BlockHash'
import {ConfirmReqMessage} from './Common'
import * as moment from 'moment'

export interface RepCrawlerDelegate {
    txBeginRead(): ReadTransaction
    blockRandom(readTransaction: ReadTransaction): Block
    isTestNetwork(): boolean
}

export default class RepCrawler {
    private readonly activeBlockHashSet = new Set<string>()

    constructor(private readonly repCrawlerDelegate: RepCrawlerDelegate) {}

    query(channel: Transport.Channel) {
        const peers = [channel]
        this.queryPeers(peers)
    }

    private queryPeers(peers: Transport.Channel[]) {
        const readTransaction = this.repCrawlerDelegate.txBeginRead()
        let block = this.repCrawlerDelegate.blockRandom(readTransaction)
        let blockHash = block.getHash()
        if(this.repCrawlerDelegate.isTestNetwork()) {
            for(let i = 0; this.exists(blockHash) && i < 4; ++i) {
                block = this.repCrawlerDelegate.blockRandom(readTransaction)
                blockHash = block.getHash()
            }
        }

        this.add(blockHash)

        for(let peer of peers) {
            this.onRepRequest(peer)
            const confirmReqMessage = new ConfirmReqMessage(block)
            peer.send(confirmReqMessage).catch(() => {
                console.error(`${new Date().toISOString()}: an error occurred while sending confirmReqMessage to peer`)
            })
        }

        setTimeout(() => {this.remove(blockHash)}, moment.duration(5, 's').asMilliseconds())

        readTransaction.finalize()
    }

    private remove(blockHash: BlockHash) {
        throw 0 // FIXME
    }

    private onRepRequest(channel: Transport.Channel) {
        throw 0 // FIXME
    }

    private add(blockHash: BlockHash) {
        this.activeBlockHashSet.add(blockHash.toString())
    }

    private exists(blockHash: BlockHash): boolean {
        return this.activeBlockHashSet.has(blockHash.toString())
    }

    start() {
        throw 0 // FIXME
    }
}
