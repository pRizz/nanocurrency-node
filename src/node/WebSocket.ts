import {TCPEndpoint} from './Common'

namespace NANOWebSocket {
    export interface ListenerDelegate {

    }

    export class Listener {
        constructor(private readonly listenerDelegate: ListenerDelegate, private readonly tcpEndpoint: TCPEndpoint) {}

        stop() {
            // TODO
        }

        run() {
            // TODO
        }
    }
}

export default NANOWebSocket
