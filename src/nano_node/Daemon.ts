import {NodeFlags} from '../node/NodeConfig'
import {promisify} from 'util'
import {promises as fs} from 'fs'
import {DaemonConfig} from '../node/DaemonConfig'
import NanoNode from '../node/NanoNode'
import {NetworkConstants} from '../lib/Config'
import Constants from '../node/Common'
const debug = require('debug')('Daemon')

async function readAndUpdateDaemonConfig(dataPath: string, daemonConfig: DaemonConfig): Promise<void> {
// TODO
}

namespace Daemon {
    export async function start(dataPath: string, nodeFlags: NodeFlags): Promise<void> {
        await fs.mkdir(dataPath, {
            recursive: true,
            mode: 0o700
        })

        const daemonConfig = new DaemonConfig(dataPath)
        const node = new NanoNode(daemonConfig.dataPath)
        debug(`Network: ${NetworkConstants.activeNetworkToString()}, version: ${Constants.getVersion()}`)
        debug(`Path: ${node.applicationPath}`)

        await node.start()
        // TODO; wip
    }
}

export default Daemon
