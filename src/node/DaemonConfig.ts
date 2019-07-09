import {NodeConfig} from './NodeConfig'

export class DaemonConfig {
    readonly nodeConfig: NodeConfig

    constructor(
        readonly dataPath: string
    ) {
        this.nodeConfig = new NodeConfig()
    }
}
