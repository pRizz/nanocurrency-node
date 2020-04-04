
interface Listener {
    accept(): Promise<NanoConnection>
    close(): void
    address: Address
}

class NanoConnection {
    close() {

    }
}

// inspired by https://github.com/denoland/deno/blob/master/std/http/server.ts
class NanoTCPServer {
    private closing = false
    private readonly connections: NanoConnection[] = []

    constructor(readonly listener: Listener) {}

    close() {
        this.closing = true
        this.listener.close()
        for(const connection of this.connections) {
            try {
                connection.close()
            } catch (e) {
                console.error(`${new Date().toISOString()}: could not close connection: `, connection)
            }
        }
    }

    stop() {

    }
}

// inspiration from https://github.com/http-kit/http-kit/blob/master/src/org/httpkit/server.clj
// https://github.com/http-kit/http-kit/blob/master/src/java/org/httpkit/server/HttpServer.java

export function runServer(): {stop: () => Boolean} {
    const server = new NanoTCPServer()

    return {
        stop() {
            server.stop()
            return true
        }
    }
}
