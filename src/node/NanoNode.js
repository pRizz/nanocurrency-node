"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BlockProcessor_1 = require("./BlockProcessor");
var BlockStore_1 = require("../secure/BlockStore");
var Ledger_1 = require("../secure/Ledger");
var moment = require("moment");
var Voting_1 = require("./Voting");
var Wallet_1 = require("./Wallet");
var BlockArrival = /** @class */ (function () {
    function BlockArrival() {
    }
    BlockArrival.prototype.add = function (block) {
        return false; // TODO
    };
    return BlockArrival;
}());
var NanoNode = /** @class */ (function () {
    function NanoNode(applicationPath) {
        this.blockArrival = new BlockArrival();
        this.votesCache = new Voting_1.VotesCache();
        this.wallets = new Wallet_1.Wallets();
        this.activeTransactions = new ActiveTransactions();
        this.blockProcessor = new BlockProcessor_1.default(this);
        this.blockStore = new BlockStore_1.BlockStore();
        this.ledger = new Ledger_1.default(this.blockStore);
        this.applicationPath = applicationPath;
    }
    NanoNode.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    NanoNode.prototype.processBlock = function (block) {
        this.blockArrival.add(block);
        this.blockProcessor.addBlock(block, moment());
    };
    NanoNode.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return this.ledger.blockStore.doesBlockExist(transaction, blockType, blockHash);
    };
    NanoNode.prototype.getEpochSigner = function () {
        return this.ledger.getEpochSigner();
    };
    NanoNode.prototype.isEpochLink = function (link) {
        return this.ledger.isEpochLink(link);
    };
    NanoNode.prototype.txBeginRead = function () {
        return this.blockStore.txBeginRead();
    };
    NanoNode.prototype.txBeginWrite = function () {
        return this.blockStore.txBeginWrite();
    };
    NanoNode.prototype.successorFrom = function (transaction, qualifiedRoot) {
        return this.ledger.successorFrom(transaction, qualifiedRoot);
    };
    NanoNode.prototype.rollback = function (transaction, blockHash, rollbackList) {
        this.ledger.rollback(transaction, blockHash, rollbackList);
    };
    NanoNode.prototype.removeRollbackList = function (rollbackList) {
        var e_1, _a;
        try {
            for (var rollbackList_1 = __values(rollbackList), rollbackList_1_1 = rollbackList_1.next(); !rollbackList_1_1.done; rollbackList_1_1 = rollbackList_1.next()) {
                var block = rollbackList_1_1.value;
                this.votesCache.remove(block.getHash());
                this.wallets.workWatcher.remove(block);
                this.activeTransactions.erase(block);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rollbackList_1_1 && !rollbackList_1_1.done && (_a = rollbackList_1.return)) _a.call(rollbackList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return NanoNode;
}());
exports.default = NanoNode;
var ActiveTransactions = /** @class */ (function () {
    function ActiveTransactions() {
    }
    // TODO
    ActiveTransactions.prototype.erase = function (block) {
    };
    return ActiveTransactions;
}());
//# sourceMappingURL=NanoNode.js.map