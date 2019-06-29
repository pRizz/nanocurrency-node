import * as program from 'commander'
import version from './Version'
import Daemon from '../src/nano_node/Daemon'
import {NodeFlags} from '../src/node/NodeConfig'
import Utility from '../src/secure/Utility'
const debug = require('debug')('CLI')

//FIXME: wrong help text: Usage: www [options]
program
    .version(version, '-V, --version')
    .option('-d, --daemon', 'Start node daemon')
    .option('--account_create', 'Run in daemon mode')
    .parse(process.argv)

export function handleCLI() {
    if(program.daemon) {
        startDaemon()
        return
    }
    if(program.account_create) {
        handleAccountCreate()
        return
    }
    // FIXME
    program.outputHelp((helpText: string) => { return helpText })
}

function startDaemon() {
    const workingDirectory = Utility.getWorkingPath(false)
    Daemon.start(workingDirectory, new NodeFlags()).catch(debug)
}

function handleAccountCreate() {
    console.log('handle account create')
}
