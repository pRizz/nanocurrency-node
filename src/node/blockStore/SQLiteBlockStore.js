"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteBlockStore = void 0;
var sequelize_1 = require("sequelize");
var Paths_1 = require("../../lib/Paths");
var tableDefinitions = [
    {
        name: 'Block',
        attributes: {
            hash: sequelize_1.DataTypes.BLOB,
            account: sequelize_1.DataTypes.BLOB,
        }
    }
];
// Tradeoffs:
// Pros:
// - simple
// - high level
// Cons:
// - slower
// - different implementation than original node's lmdb/rocksdb nosql/document store
// Performance optimization is planned for later, once this node is working and running
var SQLiteBlockStore = /** @class */ (function () {
    function SQLiteBlockStore(options, dbHandle) {
        this.dbHandle = dbHandle;
        this.BlockModel = dbHandle.define('Block', {
            hash: sequelize_1.DataTypes.BLOB,
            account: sequelize_1.DataTypes.BLOB,
        });
    }
    SQLiteBlockStore.from = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var dbHandle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbHandle = new sequelize_1.Sequelize({
                            dialect: 'sqlite',
                            storage: Paths_1.dbPath,
                        });
                        return [4 /*yield*/, dbHandle.authenticate()
                            // this.createTables(dbHandle)
                        ];
                    case 1:
                        _a.sent();
                        // this.createTables(dbHandle)
                        return [4 /*yield*/, dbHandle.sync()];
                    case 2:
                        // this.createTables(dbHandle)
                        _a.sent();
                        return [2 /*return*/, new SQLiteBlockStore(options, dbHandle)];
                }
            });
        });
    };
    SQLiteBlockStore.createTables = function (dbHandle) {
        tableDefinitions.forEach(function (tableDefinition) {
            dbHandle.define(tableDefinition.name, tableDefinition.attributes, tableDefinition.options);
        });
    };
    SQLiteBlockStore.prototype.putBlock = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dbHandle.model('Block').create({
                        hash: block.getHash().asBuffer(),
                        account: block.getAccount().publicKey.asBuffer()
                    })];
            });
        });
    };
    SQLiteBlockStore.prototype.confirmBlock = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    SQLiteBlockStore.prototype.getBlock = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var maybeBlockModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.BlockModel.findOne({
                            where: {
                                hash: hash.asBuffer()
                            }
                        })];
                    case 1:
                        maybeBlockModel = _a.sent();
                        if (!maybeBlockModel) {
                            return [2 /*return*/, Promise.reject()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SQLiteBlockStore;
}());
exports.SQLiteBlockStore = SQLiteBlockStore;
//# sourceMappingURL=SQLiteBlockStore.js.map