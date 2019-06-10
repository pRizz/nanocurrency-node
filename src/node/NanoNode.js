"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockProcessor_1 = require("./BlockProcessor");
var BlockStore_1 = require("../secure/BlockStore");
var Ledger_1 = require("../secure/Ledger");
var NanoNode = /** @class */ (function () {
    function NanoNode() {
        this.blockProcessor = new BlockProcessor_1.default(this);
        this.blockStore = new BlockStore_1.BlockStore();
        this.ledger = new Ledger_1.default(this.blockStore);
    }
    return NanoNode;
}());
exports.default = NanoNode;
//# sourceMappingURL=NanoNode.js.map