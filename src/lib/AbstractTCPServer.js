"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTCPServer = void 0;
var AbstractTCPServer = /** @class */ (function () {
    function AbstractTCPServer(props) {
    }
    AbstractTCPServer.prototype.start = function () {
        // maybe the server should emit Session objects when an entity connects
        // the session should have internal input and output streams that send bytes,
        // but these streams should be abstracted and sending and receiving messages
    };
    AbstractTCPServer.prototype.stop = function () {
    };
    return AbstractTCPServer;
}());
exports.AbstractTCPServer = AbstractTCPServer;
//# sourceMappingURL=AbstractTCPServer.js.map