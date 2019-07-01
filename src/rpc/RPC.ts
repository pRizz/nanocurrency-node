interface RPCHandler {
    processRequest(action: string, body: string, response: (arg0: string) => void): void
    stop(): void
}

export default class RPCServer {

    constructor() {

    }

    start() {
        // TODO
    }

    stop() {
        // TODO
    }
}
