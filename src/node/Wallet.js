"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallets = exports.WorkWatcher = void 0;
var WorkWatcher = /** @class */ (function () {
    function WorkWatcher() {
    }
    WorkWatcher.prototype.remove = function (block) {
        throw 0; // FIXME
    };
    return WorkWatcher;
}());
exports.WorkWatcher = WorkWatcher;
var Wallets = /** @class */ (function () {
    function Wallets() {
        this.workWatcher = new WorkWatcher();
        throw 0; // FIXME
    }
    Wallets.prototype.stop = function () {
        throw 0; // FIXME
    };
    return Wallets;
}());
exports.Wallets = Wallets;
//# sourceMappingURL=Wallet.js.map