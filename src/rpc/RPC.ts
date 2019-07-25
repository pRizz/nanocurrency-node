interface RPCHandler {
    processRequest(action: string, body: string, response: (arg0: string) => void): void
    stop(): void
}

export default class RPCServer {

    constructor() {
        throw 0 // FIXME
    }

    start() {
        throw 0 // FIXME
    }

    stop() {
        throw 0 // FIXME
    }
}
