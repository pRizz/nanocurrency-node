"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BootstrapServerType;
(function (BootstrapServerType) {
    BootstrapServerType[BootstrapServerType["undefined"] = 0] = "undefined";
    BootstrapServerType[BootstrapServerType["bootstrap"] = 1] = "bootstrap";
    BootstrapServerType[BootstrapServerType["realtime"] = 2] = "realtime";
    BootstrapServerType[BootstrapServerType["realtime_response_server"] = 3] = "realtime_response_server";
})(BootstrapServerType = exports.BootstrapServerType || (exports.BootstrapServerType = {}));
var BootstrapServer = /** @class */ (function () {
    function BootstrapServer(socket) {
        this.keepaliveFirst = false; // TODO: encapsulate
        this.socket = socket;
    }
    BootstrapServer.prototype.receive = function () {
        // TODO
    };
    return BootstrapServer;
}());
exports.BootstrapServer = BootstrapServer;
var BootstrapListener = /** @class */ (function () {
    function BootstrapListener(port, delegate) {
        this.port = port;
        this.delegate = delegate;
    }
    BootstrapListener.prototype.start = function () {
        // TODO
    };
    BootstrapListener.prototype.stop = function () {
        // TODO
    };
    return BootstrapListener;
}());
exports.BootstrapListener = BootstrapListener;
var BootstrapInitiator = /** @class */ (function () {
    function BootstrapInitiator(bootstrapInitiatorDelegate) {
        this.bootstrapInitiatorDelegate = bootstrapInitiatorDelegate;
    } // TODO
    BootstrapInitiator.prototype.stop = function () {
        // TODO
    };
    return BootstrapInitiator;
}());
exports.BootstrapInitiator = BootstrapInitiator;
//# sourceMappingURL=Bootstrap.js.map