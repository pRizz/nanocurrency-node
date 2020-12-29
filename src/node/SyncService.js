"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
var NanoTCPServer_1 = require("./NanoProtocol/NanoTCPServer");
var SyncService = /** @class */ (function () {
    function SyncService(syncServiceConfig) {
        this.syncServiceConfig = syncServiceConfig;
        this.nanoTCPServer = new NanoTCPServer_1.NanoTCPServer({
            port: syncServiceConfig.listenPort
        });
    }
    SyncService.prototype.publishBlock = function (block) {
        // TODO
    };
    SyncService.prototype.start = function () {
        this.nanoTCPServer.start();
    };
    SyncService.prototype.stop = function () {
        this.nanoTCPServer.stop();
    };
    return SyncService;
}());
exports.SyncService = SyncService;
//# sourceMappingURL=SyncService.js.map