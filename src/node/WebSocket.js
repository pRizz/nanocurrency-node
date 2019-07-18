"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NANOWebSocket;
(function (NANOWebSocket) {
    var Listener = /** @class */ (function () {
        function Listener(listenerDelegate, tcpEndpoint) {
            this.listenerDelegate = listenerDelegate;
            this.tcpEndpoint = tcpEndpoint;
        }
        Listener.prototype.stop = function () {
            // TODO
        };
        Listener.prototype.run = function () {
            // TODO
        };
        return Listener;
    }());
    NANOWebSocket.Listener = Listener;
})(NANOWebSocket || (NANOWebSocket = {}));
exports.default = NANOWebSocket;
//# sourceMappingURL=WebSocket.js.map