"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeConfig_1 = require("./NodeConfig");
var DaemonConfig = /** @class */ (function () {
    function DaemonConfig(dataPath) {
        this.dataPath = dataPath;
        this.nodeConfig = new NodeConfig_1.NodeConfig();
        // FIXME
    }
    return DaemonConfig;
}());
exports.DaemonConfig = DaemonConfig;
//# sourceMappingURL=DaemonConfig.js.map