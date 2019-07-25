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
        throw 0; // FIXME
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
        throw 0; // FIXME
    };
    BootstrapListener.prototype.stop = function () {
        throw 0; // FIXME
    };
    return BootstrapListener;
}());
exports.BootstrapListener = BootstrapListener;
var BootstrapInitiator = /** @class */ (function () {
    function BootstrapInitiator(bootstrapInitiatorDelegate) {
        this.bootstrapInitiatorDelegate = bootstrapInitiatorDelegate;
    } // TODO
    BootstrapInitiator.prototype.stop = function () {
        throw 0; // FIXME
    };
    return BootstrapInitiator;
}());
exports.BootstrapInitiator = BootstrapInitiator;
//# sourceMappingURL=Bootstrap.js.map