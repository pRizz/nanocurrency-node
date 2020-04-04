"use strict";
// modeled after a WebSocket, but handles Nano-protocol specific messages
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var NanoSocket = /** @class */ (function () {
    function NanoSocket(nanoSocketDelegate) {
        this.nanoSocketDelegate = nanoSocketDelegate;
        this.eventEmitter = new events_1.EventEmitter();
        // connect to an address with a TCP socket
    }
    return NanoSocket;
}());
exports.default = NanoSocket;
//# sourceMappingURL=NanoSocket.js.map