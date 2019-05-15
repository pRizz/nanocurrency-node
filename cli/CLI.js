"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var Version_1 = require("./Version");
//FIXME: wrong help text: Usage: www [options]
program
    .version(Version_1.default, '-V, --version')
    .option('-d, --daemon', 'Run in daemon mode')
    .option('--account_create', 'Run in daemon mode')
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
    // FIXME
    program.outputHelp(function (helpText) { return helpText; });
}
exports.handleCLI = handleCLI;
function startDaemon() {
    var app = require('../app');
    var debug = require('debug')('nanocurrency-node-template:server');
    var http = require('http');
    /**
     * Get port from environment and store in Express.
     */
    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);
    /**
     * Create HTTP server.
     */
    var server = http.createServer(app);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}
function handleAccountCreate() {
    console.log('handle account create');
}
//# sourceMappingURL=CLI.js.map