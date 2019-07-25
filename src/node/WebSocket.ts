import {TCPEndpoint} from './Common'

namespace NANOWebSocket {
    export interface ListenerDelegate {

    }

    export class Listener {
        constructor(private readonly listenerDelegate: ListenerDelegate, private readonly tcpEndpoint: TCPEndpoint) {}

        stop() {
            throw 0 // FIXME
        }

        run() {
            throw 0 // FIXME
        }
    }
}

export default NANOWebSocket
