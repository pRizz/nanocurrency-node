import {NodeFlags} from '../node/NodeConfig'
import {promisify} from 'util'
import {promises as fs} from 'fs'
import {DaemonConfig} from '../node/DaemonConfig'
import NanoNode from '../node/NanoNode'
import {NetworkConstants} from '../lib/Config'
import Constants from '../node/Common'
import IPCServer from '../node/IPC'
import RPCServer from '../rpc/RPC'
const debug = require('debug')('Daemon')

async function readAndUpdateDaemonConfig(dataPath: string, daemonConfig: DaemonConfig): Promise<void> {
// TODO
}

function startRPCServer() {
    const rpcServer = new RPCServer()
    // TODO
}

namespace Daemon {
    export async function start(dataPath: string, nodeFlags: NodeFlags, isRPCEnabled: boolean): Promise<void> {
        await fs.mkdir(dataPath, {
            recursive: true,
            mode: 0o700
        })

        const daemonConfig = new DaemonConfig(dataPath)
        const node = await NanoNode.create(daemonConfig.dataPath, nodeFlags, daemonConfig.nodeConfig)
        debug(`Network: ${NetworkConstants.activeNetworkToString()}, version: ${Constants.getVersion()}`)
        debug(`Path: ${node.applicationPath}`)

        await node.start()

        const ipcServer = new IPCServer(true, true) // FIXME

        if(isRPCEnabled) {
            startRPCServer()
        }

        // TODO; wip
    }
}

export default Daemon
