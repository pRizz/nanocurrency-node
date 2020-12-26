"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToFile = void 0;
var fs = require("fs");
function logToFile(data) {
    var filename = new Date().toISOString().replace(/:/g, '-');
    var filePath = "logs/" + filename + ".log";
    fs.writeFile(filePath, data, function (err) {
        if (err)
            throw err;
        console.log(new Date().toISOString() + ": logged to " + filePath);
    });
}
exports.logToFile = logToFile;
//# sourceMappingURL=debugging.js.map