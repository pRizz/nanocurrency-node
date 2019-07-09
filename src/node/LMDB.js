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
Object.defineProperty(exports, "__esModule", { value: true });
var BlockStore_1 = require("../secure/BlockStore");
var path = require("path");
var fs_1 = require("fs");
var DiagnosticsConfig_1 = require("./DiagnosticsConfig");
var LMDBTXNTracker_1 = require("./LMDBTXNTracker");
var moment = require("moment");
var lmdb = require('node-lmdb');
var MDBEnv = /** @class */ (function () {
    function MDBEnv(lmdbEnvironment) {
        this.lmdbEnvironment = lmdbEnvironment;
    }
    MDBEnv.create = function (dbPath, maxDBs, mapSize) {
        if (maxDBs === void 0) { maxDBs = 128; }
        if (mapSize === void 0) { mapSize = 128 * 1024 * 1024 * 1024; }
        return __awaiter(this, void 0, void 0, function () {
            var lmdbEnvironment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.configureParentPath(dbPath)];
                    case 1:
                        _a.sent();
                        lmdbEnvironment = new lmdb.Env();
                        lmdbEnvironment.open({
                            path: dbPath,
                            maxDbs: maxDBs,
                            mapSize: mapSize,
                            noSubdir: true,
                        });
                        return [2 /*return*/, new MDBEnv(lmdbEnvironment)];
                }
            });
        });
    };
    MDBEnv.configureParentPath = function (pathName) {
        return __awaiter(this, void 0, void 0, function () {
            var parentDirectory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parentDirectory = path.dirname(pathName);
                        return [4 /*yield*/, fs_1.promises.chmod(parentDirectory, 448)
                            // FIXME: try mkdir too
                        ];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MDBEnv.prototype.txBeginRead = function (mdbTXNCallbacks) {
        return new BlockStore_1.ReadTransaction(new ReadMDBTXN(this, mdbTXNCallbacks));
    };
    MDBEnv.prototype.txBeginWrite = function (mdbTXNCallbacks) {
        return new BlockStore_1.WriteTransaction(new WriteMDBTXN(this, mdbTXNCallbacks));
    };
    return MDBEnv;
}());
exports.MDBEnv = MDBEnv;
var ReadMDBTXN = /** @class */ (function () {
    function ReadMDBTXN(mdbEnv, mdbTXNCallbacks) {
        this.mdbTXNCallbacks = mdbTXNCallbacks;
        this.mdbTXNHandle = mdbEnv.lmdbEnvironment.beginTxn();
        mdbTXNCallbacks.txnStart(this);
    }
    ReadMDBTXN.prototype.getHandle = function () {
        return this.mdbTXNHandle;
    };
    ReadMDBTXN.prototype.renew = function () {
        this.mdbTXNHandle.renew();
        this.mdbTXNCallbacks.txnStart(this);
    };
    ReadMDBTXN.prototype.reset = function () {
        this.mdbTXNHandle.reset();
        this.mdbTXNCallbacks.txnEnd(this);
    };
    return ReadMDBTXN;
}());
exports.ReadMDBTXN = ReadMDBTXN;
var WriteMDBTXN = /** @class */ (function () {
    function WriteMDBTXN(environment, mdbTXNCallbacks) {
        this.environment = environment;
        this.mdbTXNCallbacks = mdbTXNCallbacks;
        this.renew();
    }
    WriteMDBTXN.prototype.getHandle = function () {
        // TODO
    };
    WriteMDBTXN.prototype.commit = function () {
        // TODO
    };
    WriteMDBTXN.prototype.renew = function () {
        // TODO
    };
    return WriteMDBTXN;
}());
var MDBTXNCallbacks = /** @class */ (function () {
    function MDBTXNCallbacks(txnStart, txnEnd) {
        if (txnStart === void 0) { txnStart = function () { }; }
        if (txnEnd === void 0) { txnEnd = function () { }; }
        this.txnStart = txnStart;
        this.txnEnd = txnEnd;
    }
    return MDBTXNCallbacks;
}());
var MDBStore = /** @class */ (function () {
    function MDBStore(mdbEnv, txnTrackingEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration) {
        this.mdbEnv = mdbEnv;
        this.txnTrackingEnabled = txnTrackingEnabled;
        this.mdbTXNTracker = new LMDBTXNTracker_1.MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration);
        var isFullyUpgraded = false;
        // TODO
    }
    MDBStore.create = function (dbPath, maxDBs, txnTrackingConfig, blockProcessorBatchMaxDuration) {
        if (maxDBs === void 0) { maxDBs = 128; }
        if (txnTrackingConfig === void 0) { txnTrackingConfig = new DiagnosticsConfig_1.TXNTrackingConfig(); }
        if (blockProcessorBatchMaxDuration === void 0) { blockProcessorBatchMaxDuration = moment.duration('5000', 'ms'); }
        return __awaiter(this, void 0, void 0, function () {
            var mdbEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MDBEnv.create(dbPath, maxDBs)];
                    case 1:
                        mdbEnv = _a.sent();
                        return [2 /*return*/, new MDBStore(mdbEnv, txnTrackingConfig.isEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration)];
                }
            });
        });
    };
    MDBStore.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return false; // FIXME
    };
    MDBStore.prototype.peersFromTransaction = function (transaction) {
        return []; // FIXME
    };
    MDBStore.prototype.txBeginRead = function () {
        return this.mdbEnv.txBeginRead(this.createTxnCallbacks());
    };
    MDBStore.prototype.createTxnCallbacks = function () {
        var _this = this;
        if (!this.txnTrackingEnabled) {
            return new MDBTXNCallbacks();
        }
        return new MDBTXNCallbacks(function (transactionImpl) {
            _this.mdbTXNTracker.add(transactionImpl);
        }, function (transactionImpl) {
            _this.mdbTXNTracker.erase(transactionImpl);
        });
    };
    MDBStore.prototype.txBeginWrite = function () {
        return this.mdbEnv.txBeginWrite(this.createTxnCallbacks());
    };
    return MDBStore;
}());
exports.MDBStore = MDBStore;
//# sourceMappingURL=LMDB.js.map