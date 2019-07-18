import {Socket} from './Socket'
import Account from '../lib/Account'

export enum BootstrapServerType {
    undefined,
    bootstrap,
    realtime,
    realtime_response_server
}

export class BootstrapServer {
    private readonly socket: Socket // TODO: don't share
    keepaliveFirst = false // TODO: encapsulate
    type: BootstrapServerType // TODO: encapsulate
    remoteNodeID?: Account // TODO: encapsulate

    constructor(socket: Socket) {
        this.socket = socket
    }

    receive() {
        // TODO
    }
}

export interface BootstrapListenerDelegate {

}

export class BootstrapListener {
    constructor(private readonly port: number, private readonly delegate: BootstrapListenerDelegate) {}

    start() {
        // TODO
    }

    stop() {
        // TODO
    }
}

export interface BootstrapInitiatorDelegate {

}

export class BootstrapInitiator {

    constructor(private readonly bootstrapInitiatorDelegate: BootstrapInitiatorDelegate) {} // TODO

    stop() {
        // TODO
    }
}
