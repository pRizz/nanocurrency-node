
// modeled after a WebSocket, but handles Nano-protocol specific messages

import {EventEmitter} from 'events'
import {ConfirmReqMessage, KeepaliveMessage, NodeIDHandshakeMessage} from '../Common'

export interface NanoSocketDelegate {
    onKeepaliveMessage(keepaliveMessage: KeepaliveMessage): void
    onConfirmReqMessage(confirmReqMessage: ConfirmReqMessage): void
    onNodeIDHandshakeMessage(nodeIDHandshakeMessage: NodeIDHandshakeMessage): void
    // TODO: messages from Common.ts
}

export default class NanoSocket {

    readonly eventEmitter = new EventEmitter()

    constructor(readonly nanoSocketDelegate: NanoSocketDelegate) {
        // connect to an address with a TCP socket
    }
}
