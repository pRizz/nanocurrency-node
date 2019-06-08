"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt64_1 = require("./UInt64");
var WorkValidator_1 = require("./WorkValidator");
var Work_1 = require("./Work");
// TODO: optimize; use PowGeneratorWorkers
var PowGenerator;
(function (PowGenerator) {
    function generate(hash) {
        var validWork;
        do {
            validWork = new Work_1.default(UInt64_1.default.getRandom());
        } while (!WorkValidator_1.default.isWorkValid(hash, validWork));
        return validWork;
    }
    PowGenerator.generate = generate;
})(PowGenerator || (PowGenerator = {}));
exports.default = PowGenerator;
//# sourceMappingURL=PowGenerator.js.map