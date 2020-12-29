"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPath = exports.defaultDBFileName = exports.defaultDataPaths = exports.defaultAppName = void 0;
var envPaths = require("env-paths");
var path = require("path");
exports.defaultAppName = "nano-node-js"; // FIXME: create unique app name
exports.defaultDataPaths = envPaths(exports.defaultAppName);
exports.defaultDBFileName = "ledger.sqlite";
exports.dbPath = path.join(exports.defaultDataPaths.data, exports.defaultDBFileName);
//# sourceMappingURL=Paths.js.map