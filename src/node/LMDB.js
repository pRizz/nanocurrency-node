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
var BlockHash_1 = require("../lib/BlockHash");
var Common_1 = require("./Common");
var path = require("path");
var fs_1 = require("fs");
var moment = require("moment");
var DiagnosticsConfig_1 = require("./DiagnosticsConfig");
var LMDBTXNTracker_1 = require("./LMDBTXNTracker");
var UInt256_1 = require("../lib/UInt256");
var Common_2 = require("../secure/Common");
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
    MDBEnv.prototype.getTX = function () {
        return this.tx;
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
        throw 0; // FIXME
    };
    WriteMDBTXN.prototype.commit = function () {
        throw 0; // FIXME
    };
    WriteMDBTXN.prototype.renew = function () {
        throw 0; // FIXME
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
var MDBIterator = /** @class */ (function () {
    function MDBIterator(cursor, mdbKeyValueInterfaceConstructible, mdbValueInterfaceConstructible) {
        this.cursor = cursor;
        this.mdbKeyValueInterfaceConstructible = mdbKeyValueInterfaceConstructible;
        this.mdbValueInterfaceConstructible = mdbValueInterfaceConstructible;
    }
    MDBIterator.from = function (transaction, db, mdbVal, mdbKeyValueInterfaceConstructible, mdbValueInterfaceConstructible, epoch) {
        if (epoch === void 0) { epoch = Common_2.Epoch.unspecified; }
        var cursor = new lmdb.Cursor(transaction.getHandle(), db);
        var iterator = new MDBIterator(cursor, mdbKeyValueInterfaceConstructible, mdbValueInterfaceConstructible);
        iterator.dbKey = mdbVal;
        var currentKey = cursor.goToRange(mdbVal);
        if (currentKey === null) {
            iterator.clear();
            return iterator;
        }
        var currentValueBuffer = cursor.getCurrentBinary();
        if (currentValueBuffer !== null) {
            try {
                var currentValue = mdbValueInterfaceConstructible.fromDBBuffer(currentValueBuffer);
            }
            catch (e) {
                iterator.clear();
            }
        }
        return iterator;
    };
    MDBIterator.prototype.clear = function () {
        // FIXME; possibly not needed
    };
    MDBIterator.prototype.next = function () {
        if (this.cursor === null) {
            return;
        }
        var nextKey = this.cursor.goToNext();
        if (nextKey === null) {
            console.log('nextKey is null');
            this.dbKey = undefined;
            this.dbValue = undefined;
            return;
        }
        console.log('nextKey');
        console.log(nextKey);
        console.log('this.cursor');
        console.log(this.cursor);
        this.dbKey = this.mdbKeyValueInterfaceConstructible.fromDBKeyBuffer(nextKey);
        this.dbValue = this.mdbValueInterfaceConstructible.fromDBBuffer(this.cursor.getCurrentBinary());
    };
    MDBIterator.prototype.equals = function (other) {
        return this.keysEqual(other.getCurrentKey()) && this.valuesEqual(other.getCurrentValue());
    };
    MDBIterator.prototype.keysEqual = function (otherKey) {
        if (this.dbKey === undefined) {
            return otherKey === undefined;
        }
        if (otherKey === undefined) {
            return false;
        }
        return this.dbKey.equals(otherKey);
    };
    MDBIterator.prototype.valuesEqual = function (otherValue) {
        if (this.dbValue === undefined) {
            return otherValue === undefined;
        }
        if (otherValue === undefined) {
            return false;
        }
        return this.dbValue.equals(otherValue);
    };
    MDBIterator.prototype.getCurrent = function () {
        return [this.dbKey, this.dbValue];
    };
    MDBIterator.prototype.getCurrentKey = function () {
        return this.dbKey;
    };
    MDBIterator.prototype.getCurrentValue = function () {
        return this.dbValue;
    };
    return MDBIterator;
}());
exports.MDBIterator = MDBIterator;
var MDBStore = /** @class */ (function () {
    function MDBStore(mdbEnv, txnTrackingEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration, batchSize, shouldDropUnchecked) {
        this.mdbEnv = mdbEnv;
        this.txnTrackingEnabled = txnTrackingEnabled;
        this.mdbTXNTracker = new LMDBTXNTracker_1.MDBTXNTracker(txnTrackingConfig, blockProcessorBatchMaxDuration);
        if (this.isFullyUpgraded()) {
            this.openDBs(false);
        }
        else {
            this.openDBs(true);
            var transaction = this.txBeginWrite();
            this.doUpgrades(transaction, batchSize);
            transaction.finalize();
        }
        if (shouldDropUnchecked) {
            this.clearUnchecked();
        }
    }
    MDBStore.create = function (dbPath, maxDBs, txnTrackingConfig, blockProcessorBatchMaxDuration, batchSize, shouldDropUnchecked) {
        if (maxDBs === void 0) { maxDBs = 128; }
        if (txnTrackingConfig === void 0) { txnTrackingConfig = new DiagnosticsConfig_1.TXNTrackingConfig(); }
        if (blockProcessorBatchMaxDuration === void 0) { blockProcessorBatchMaxDuration = moment.duration('5000', 'ms'); }
        if (batchSize === void 0) { batchSize = 512; }
        if (shouldDropUnchecked === void 0) { shouldDropUnchecked = false; }
        return __awaiter(this, void 0, void 0, function () {
            var mdbEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MDBEnv.create(dbPath, maxDBs)];
                    case 1:
                        mdbEnv = _a.sent();
                        return [2 /*return*/, new MDBStore(mdbEnv, txnTrackingConfig.isEnabled, txnTrackingConfig, blockProcessorBatchMaxDuration, batchSize, shouldDropUnchecked)];
                }
            });
        });
    };
    MDBStore.prototype.blockRandom = function (readTransaction) {
        var blockCounts = this.getBlockCounts(readTransaction);
        var blockIndex = Math.floor(Math.random() * blockCounts.getSum());
        if (blockIndex < blockCounts.send) {
            return this.blockRandomFor(readTransaction, this.sendBlocksDB, SendBlock);
        }
        blockIndex -= blockCounts.send;
        if (blockIndex < blockCounts.receive) {
            return this.blockRandomFor(readTransaction, this.receiveBlocksDB);
        }
        blockIndex -= blockCounts.receive;
        if (blockIndex < blockCounts.open) {
            return this.blockRandomFor(readTransaction, this.openBlocksDB);
        }
        blockIndex -= blockCounts.open;
        if (blockIndex < blockCounts.change) {
            return this.blockRandomFor(readTransaction, this.changeBlocksDB);
        }
        blockIndex -= blockCounts.change;
        if (blockIndex < blockCounts.stateV0) {
            return this.blockRandomFor(readTransaction, this.stateBlocksV0DB);
        }
        return this.blockRandomFor(readTransaction, this.stateBlocksV1DB);
    };
    MDBStore.prototype.blockRandomFor = function (transaction, db, mdbValueInterfaceConstructible) {
        var blockHash = new BlockHash_1.default(UInt256_1.default.getRandom());
        var storeIterator = MDBIterator.from(transaction, db, blockHash, BlockHash_1.default, mdbValueInterfaceConstructible);
    };
    MDBStore.prototype.getBlockCounts = function (transaction) {
        return new Common_2.BlockCounts(this.getEntryCount(transaction, this.sendBlocksDB), this.getEntryCount(transaction, this.receiveBlocksDB), this.getEntryCount(transaction, this.openBlocksDB), this.getEntryCount(transaction, this.changeBlocksDB), this.getEntryCount(transaction, this.stateBlocksV0DB), this.getEntryCount(transaction, this.stateBlocksV1DB));
    };
    MDBStore.prototype.getEntryCount = function (transaction, db) {
        var stat = db.stat(transaction);
        return stat.entryCount;
    };
    MDBStore.prototype.clearUnchecked = function () {
        this.uncheckedInfoDB.drop();
    };
    MDBStore.prototype.doUpgrades = function (writeTransaction, batchSize) {
        var version = this.versionGet(writeTransaction);
        switch (version) {
            // @ts-ignore
            case 1:
                this.upgradeV1ToV2(writeTransaction);
            /* fall through */
            // @ts-ignore
            case 2:
                this.upgradeV2ToV3(writeTransaction);
            /* fall through */
            // TODO: all cases
            case 14:
                break;
            default:
                console.error("Invalid db version during upgrade: " + version);
        }
    };
    MDBStore.prototype.upgradeV1ToV2 = function (transaction) {
        // TODO
    };
    MDBStore.prototype.upgradeV2ToV3 = function (transaction) {
        // TODO
    };
    MDBStore.prototype.isFullyUpgraded = function () {
        var result = false;
        var transaction = this.txBeginRead();
        try {
            this.metaDB = this.mdbEnv.lmdbEnvironment.openDBi({
                name: 'meta',
                create: true,
                keyIsBuffer: true
            });
            result = this.versionGet(transaction) === MDBStore.version;
            this.metaDB.close();
        }
        catch (e) {
            console.error("An error occurred while checking db version");
        }
        transaction.finalize();
        return result;
    };
    MDBStore.prototype.versionGet = function (transaction) {
        var versionKey = new UInt256_1.default({
            hex: "0000000000000000000000000000000000000000000000000000000000000001"
        });
        var resultData = transaction.getHandle().getBinary(this.metaDB, versionKey.asBuffer());
        var result = 1;
        if (resultData !== null) {
            var resultUInt256 = new UInt256_1.default({ buffer: resultData });
            result = resultUInt256.asBuffer().readUInt32BE(28); // get last 4 bytes of 32 bytes
        }
        return result;
    };
    // throws
    MDBStore.prototype.openDBs = function (shouldCreate) {
        this.peersDB = this.mdbEnv.lmdbEnvironment.openDBi({
            name: 'peers',
            create: shouldCreate,
            keyIsBuffer: true
        });
    };
    MDBStore.prototype.doesBlockExist = function (transaction, blockType, blockHash) {
        return false; // FIXME
    };
    MDBStore.prototype.peersFromTransaction = function (transaction) {
        var cursor = new lmdb.Cursor(transaction, this.peersDB);
        var peers = new Array();
        for (var key = cursor.goToFirst(); key !== null; key = cursor.goToNext()) {
            var udpEndpointBuffer = cursor.getCurrentBinary();
            peers.push(Common_1.UDPEndpoint.fromDB(udpEndpointBuffer));
        }
        return peers;
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
    MDBStore.prototype.getPeersBegin = function (transaction) {
        var cursor = new lmdb.Cursor(transaction, this.peersDB);
        return new MDBIterator(cursor, Common_1.UDPEndpoint, BlockStore_1.DBNoValue);
    };
    MDBStore.prototype.getPeersEnd = function () {
        return new MDBIterator(null, Common_1.UDPEndpoint, BlockStore_1.DBNoValue);
    };
    MDBStore.version = 14;
    return MDBStore;
}());
exports.MDBStore = MDBStore;
// maps to MDBVal in C++ project
var MDBValueWrapper = /** @class */ (function () {
    function MDBValueWrapper(value) {
        this.value = value;
    }
    MDBValueWrapper.prototype.getRawMDBValue = function () {
        return this.rawMDBValue;
    };
    MDBValueWrapper.prototype.getValue = function () {
        return this.value;
    };
    MDBValueWrapper.prototype.equals = function (other) {
        return this.value.equals(other.value); // TODO: audit
    };
    MDBValueWrapper.prototype.asBuffer = function () {
        return this.value.asBuffer();
    };
    MDBValueWrapper.prototype.getDBSize = function () {
        return this.value.getDBSize();
    };
    return MDBValueWrapper;
}());
//# sourceMappingURL=LMDB.js.map