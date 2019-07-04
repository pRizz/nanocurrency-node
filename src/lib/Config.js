"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var publishTestThresholdHex = 'ff00000000000000';
var publishFullThresholdHex = 'ffffffc000000000';
var NANONetworks;
(function (NANONetworks) {
    NANONetworks[NANONetworks["nanoTestNetwork"] = 0] = "nanoTestNetwork";
    NANONetworks[NANONetworks["raiTestNetwork"] = 0] = "raiTestNetwork";
    NANONetworks[NANONetworks["nanoBetaNetwork"] = 1] = "nanoBetaNetwork";
    NANONetworks[NANONetworks["raiBetaNetwork"] = 1] = "raiBetaNetwork";
    NANONetworks[NANONetworks["nanoLiveNetwork"] = 2] = "nanoLiveNetwork";
    NANONetworks[NANONetworks["raiLiveNetwork"] = 2] = "raiLiveNetwork";
})(NANONetworks = exports.NANONetworks || (exports.NANONetworks = {}));
var NetworkConstants = /** @class */ (function () {
    function NetworkConstants() {
    }
    NetworkConstants.activeNetworkToString = function () {
        if (NetworkConstants.activeNetwork === NANONetworks.nanoLiveNetwork) {
            return 'live';
        }
        if (NetworkConstants.activeNetwork === NANONetworks.nanoBetaNetwork) {
            return 'beta';
        }
        return 'test';
    };
    NetworkConstants.isLiveNetwork = function () {
        switch (NetworkConstants.activeNetwork) {
            case NANONetworks.nanoLiveNetwork: return true;
            case NANONetworks.nanoBetaNetwork: return false;
            case NANONetworks.nanoTestNetwork: return false;
        }
    };
    NetworkConstants.publishThresholdDifficulty = new UInt64_1.default({ hex: publishFullThresholdHex });
    NetworkConstants.activeNetwork = NANONetworks.nanoLiveNetwork;
    return NetworkConstants;
}());
exports.NetworkConstants = NetworkConstants;
//# sourceMappingURL=Config.js.map