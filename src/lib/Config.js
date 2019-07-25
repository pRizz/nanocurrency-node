"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var publishTestThresholdHex = 'ff00000000000000';
var publishFullThresholdHex = 'ffffffc000000000';
var NANONetwork;
(function (NANONetwork) {
    NANONetwork[NANONetwork["nanoTestNetwork"] = 0] = "nanoTestNetwork";
    NANONetwork[NANONetwork["raiTestNetwork"] = 0] = "raiTestNetwork";
    NANONetwork[NANONetwork["nanoBetaNetwork"] = 1] = "nanoBetaNetwork";
    NANONetwork[NANONetwork["raiBetaNetwork"] = 1] = "raiBetaNetwork";
    NANONetwork[NANONetwork["nanoLiveNetwork"] = 2] = "nanoLiveNetwork";
    NANONetwork[NANONetwork["raiLiveNetwork"] = 2] = "raiLiveNetwork";
})(NANONetwork = exports.NANONetwork || (exports.NANONetwork = {}));
var NetworkConstants = /** @class */ (function () {
    function NetworkConstants(currentNetwork) {
        if (currentNetwork === void 0) { currentNetwork = NetworkConstants.activeNetwork; }
        this.currentNetwork = currentNetwork;
        this.defaultWebSocketPort = this.isLiveNetwork() ? 7078 : this.isBetaNetwork() ? 57000 : 47000;
    }
    NetworkConstants.activeNetworkToString = function () {
        if (NetworkConstants.activeNetwork === NANONetwork.nanoLiveNetwork) {
            return 'live';
        }
        if (NetworkConstants.activeNetwork === NANONetwork.nanoBetaNetwork) {
            return 'beta';
        }
        return 'test';
    };
    NetworkConstants.isLiveNetwork = function () {
        switch (NetworkConstants.activeNetwork) {
            case NANONetwork.nanoLiveNetwork: return true;
            case NANONetwork.nanoBetaNetwork: return false;
            case NANONetwork.nanoTestNetwork: return false;
        }
    };
    NetworkConstants.prototype.getDefaultNodePort = function () {
        return this.isLiveNetwork() ? 7075 : this.isBetaNetwork() ? 54000 : 44000;
    };
    NetworkConstants.prototype.isLiveNetwork = function () {
        return this.currentNetwork === NANONetwork.nanoLiveNetwork;
    };
    NetworkConstants.prototype.isBetaNetwork = function () {
        return this.currentNetwork === NANONetwork.nanoBetaNetwork;
    };
    NetworkConstants.prototype.isTestNetwork = function () {
        return this.currentNetwork === NANONetwork.nanoTestNetwork;
    };
    NetworkConstants.publishThresholdDifficulty = new UInt64_1.default({ hex: publishFullThresholdHex });
    NetworkConstants.activeNetwork = NANONetwork.nanoLiveNetwork;
    return NetworkConstants;
}());
exports.NetworkConstants = NetworkConstants;
//# sourceMappingURL=Config.js.map