"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var WorkValidator_1 = require("./WorkValidator");
// TODO: optimize; use PowGeneratorWorkers
var PowGenerator;
(function (PowGenerator) {
    function generate(hash) {
        var validWorkUInt64;
        do {
            validWorkUInt64 = UInt64_1.default.getRandom();
        } while (!WorkValidator_1.default.isWorkValid(hash, validWorkUInt64));
        return validWorkUInt64;
    }
    PowGenerator.generate = generate;
})(PowGenerator || (PowGenerator = {}));
exports.default = PowGenerator;
//# sourceMappingURL=PowGenerator.js.map