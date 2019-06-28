"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorkWatcher = /** @class */ (function () {
    function WorkWatcher() {
    }
    // TODO
    WorkWatcher.prototype.remove = function (block) {
    };
    return WorkWatcher;
}());
exports.WorkWatcher = WorkWatcher;
var Wallets = /** @class */ (function () {
    function Wallets() {
        this.workWatcher = new WorkWatcher();
    }
    return Wallets;
}());
exports.Wallets = Wallets;
//# sourceMappingURL=Wallet.js.map