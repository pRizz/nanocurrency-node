"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCLI = void 0;
var program = require("commander");
var Version_1 = require("./Version");
var Daemon_1 = require("../src/nano_node/Daemon");
var NodeConfig_1 = require("../src/node/NodeConfig");
var Utility_1 = require("../src/secure/Utility");
var TestApi_1 = require("../test-client/TestApi");
var debug = require('debug')('CLI');
//FIXME: wrong help text: Usage: www [options]
program
    .version(Version_1.default, '-V, --version')
    .option('-d, --daemon', 'Start node daemon')
    .option('--account_create', 'Run in daemon mode')
    .option('--_dev_debug', 'Run debug code')
    .parse(process.argv);
function handleCLI() {
    if (program.daemon) {
        startDaemon();
        return;
    }
    if (program.account_create) {
        handleAccountCreate();
        return;
    }
    if (program._dev_debug) {
        handleDevDebug();
        return;
    }
    // FIXME
    program.outputHelp(function (helpText) { return helpText; });
}
exports.handleCLI = handleCLI;
function startDaemon() {
    var workingDirectory = Utility_1.default.getWorkingPath(false);
    Daemon_1.default.run(workingDirectory, new NodeConfig_1.NodeFlags(), true).catch(debug); // FIXME
}
function handleAccountCreate() {
    console.log('handle account create');
}
function handleDevDebug() {
    console.log('handle dev debug');
    TestApi_1.testSendKeepalive();
}
//# sourceMappingURL=CLI.js.map