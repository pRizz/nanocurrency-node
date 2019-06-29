"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var path = require("path");
var Config_1 = require("../lib/Config");
function getPathSuffix(isLegacy) {
    switch (Config_1.NetworkConstants.activeNetwork) {
        case Config_1.NANONetworks.nanoLiveNetwork: return isLegacy ? 'RaiBlocks' : 'Nano';
        case Config_1.NANONetworks.nanoBetaNetwork: return isLegacy ? 'RaiBlocksBeta' : 'NanoBeta';
        case Config_1.NANONetworks.nanoTestNetwork: return isLegacy ? 'RaiBlocksTest' : 'NanoTest';
    }
}
var Utility;
(function (Utility) {
    function getWorkingPath(isLegacy) {
        return path.join(os.homedir(), getPathSuffix(isLegacy));
    }
    Utility.getWorkingPath = getWorkingPath;
})(Utility || (Utility = {}));
exports.default = Utility;
//# sourceMappingURL=Utility.js.map