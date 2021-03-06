"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var IPCServer = /** @class */ (function () {
    function IPCServer(isTransportDomainEnabled, isTransportTCPEnabled) {
        this.transports = new Array();
        this.isTransportDomainEnabled = isTransportDomainEnabled;
        this.isTransportTCPEnabled = isTransportTCPEnabled;
        throw 0; // FIXME
    }
    IPCServer.prototype.stop = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.transports), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transport = _c.value;
                transport.stop();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return IPCServer;
}());
exports.default = IPCServer;
//# sourceMappingURL=IPC.js.map