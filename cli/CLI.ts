import * as program from 'commander'
import version from './Version'
import Daemon from '../src/nano_node/Daemon'
import {NodeFlags} from '../src/node/NodeConfig'
import Utility from '../src/secure/Utility'
import {testSendKeepalive} from '../test-ad-hoc/TestApi'
const debug = require('debug')('CLI')

//FIXME: wrong help text: Usage: www [options]
program
    .version(version, '-V, --version')
    .option('-d, --daemon', 'Start node daemon')
    .option('--account_create', 'Run in daemon mode')
    .option('--_dev_debug', 'Run debug code')
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
    if(program._dev_debug) {
        handleDevDebug()
        return
    }
    // FIXME
    program.outputHelp((helpText: string) => { return helpText })
}

function startDaemon() {
    const workingDirectory = Utility.getWorkingPath(false)
    Daemon.run(workingDirectory, new NodeFlags(), true).catch(debug) // FIXME
}

function handleAccountCreate() {
    console.log('handle account create')
}

function handleDevDebug() {
    console.log('handle dev debug')
    testSendKeepalive()
}
