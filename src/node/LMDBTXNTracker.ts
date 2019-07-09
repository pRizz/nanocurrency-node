import {TXNTrackingConfig} from './DiagnosticsConfig'
import {Duration} from 'moment'
import {TransactionImpl} from '../secure/BlockStore'

export class MDBTXNTracker {
    constructor(
        private readonly txnTrackingConfig: TXNTrackingConfig,
        private readonly blockProcessorBatchMaxDuration: Duration
    ) {}

    add(transactionImpl: TransactionImpl) {
        // TODO
    }

    erase(transactionImpl: TransactionImpl) {
        // TODO
    }
}
