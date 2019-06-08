"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt256_1 = require("../src/lib/UInt256");
var UInt64_1 = require("../src/lib/UInt64");
var assert = require("assert");
var WorkValidator_1 = require("../src/lib/WorkValidator");
var BlockHash_1 = require("../src/lib/BlockHash");
var Work_1 = require("../src/lib/Work");
describe('WorkValidator', function () {
    describe('#validate()', function () {
        it('should validate work', function () {
            var blockHashValue = new UInt256_1.default({
                hex: '60E6F8E0017F59C8CE5447C1F1E951CAD302661DC40E44C4ECEA2F7F835D3E7B'
            });
            var blockHash = new BlockHash_1.default(blockHashValue);
            var work = new Work_1.default(new UInt64_1.default({
                hex: 'CB376DF467B7270C'
            }));
            assert(WorkValidator_1.default.isWorkValid(blockHash, work));
        });
    });
});
//# sourceMappingURL=TestWorkValidator.js.map