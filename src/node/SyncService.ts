import {NanoTCPServer} from './NanoProtocol/NanoTCPServer'
import Block from '../lib/Block'

export interface SyncServiceConfig {
    listenPort: number
}

export class SyncService {
    private readonly nanoTCPServer: NanoTCPServer
    constructor(private readonly syncServiceConfig: SyncServiceConfig) {
        this.nanoTCPServer = new NanoTCPServer({
            port: syncServiceConfig.listenPort
        })
    }

    publishBlock(block: Block) {
        // TODO
    }

    start() {
        this.nanoTCPServer.start()
    }

    stop() {
        this.nanoTCPServer.stop()
    }
}
