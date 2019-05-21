"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var publishTestThresholdHex = 'ff00000000000000';
var publishFullThresholdHex = 'ffffffc000000000';
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.publishThreshold = new UInt64_1.default({ hex: publishFullThresholdHex });
    return Config;
}());
exports.default = Config;
//# sourceMappingURL=Config.js.map