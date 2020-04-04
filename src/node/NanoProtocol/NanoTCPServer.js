"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NanoConnection = /** @class */ (function () {
    function NanoConnection() {
    }
    NanoConnection.prototype.close = function () {
    };
    return NanoConnection;
}());
// inspired by https://github.com/denoland/deno/blob/master/std/http/server.ts
var NanoTCPServer = /** @class */ (function () {
    function NanoTCPServer(listener) {
        this.listener = listener;
        this.closing = false;
        this.connections = [];
    }
    NanoTCPServer.prototype.close = function () {
        var e_1, _a;
        this.closing = true;
        this.listener.close();
        try {
            for (var _b = __values(this.connections), _c = _b.next(); !_c.done; _c = _b.next()) {
                var connection = _c.value;
                try {
                    connection.close();
                }
                catch (e) {
                    console.error(new Date().toISOString() + ": could not close connection: ", connection);
                }
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
    NanoTCPServer.prototype.stop = function () {
    };
    return NanoTCPServer;
}());
// inspiration from https://github.com/http-kit/http-kit/blob/master/src/org/httpkit/server.clj
// https://github.com/http-kit/http-kit/blob/master/src/java/org/httpkit/server/HttpServer.java
function runServer() {
    var server = new NanoTCPServer();
    return {
        stop: function () {
            server.stop();
            return true;
        }
    };
}
exports.runServer = runServer;
//# sourceMappingURL=NanoTCPServer.js.map