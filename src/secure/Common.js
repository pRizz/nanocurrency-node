"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UInt16_1 = require("../lib/UInt16");
var UncheckedInfo = /** @class */ (function () {
    function UncheckedInfo(props) {
        this.block = props.block;
        this.account = props.account;
        this.modified = props.modified;
        this.signatureVerification = props.signatureVerification;
    }
    return UncheckedInfo;
}());
exports.UncheckedInfo = UncheckedInfo;
var ProcessReturn = /** @class */ (function () {
    function ProcessReturn() {
    }
    return ProcessReturn;
}());
exports.ProcessReturn = ProcessReturn;
var ProcessResult;
(function (ProcessResult) {
    ProcessResult[ProcessResult["progress"] = 0] = "progress";
    ProcessResult[ProcessResult["bad_signature"] = 1] = "bad_signature";
    ProcessResult[ProcessResult["old"] = 2] = "old";
    ProcessResult[ProcessResult["negative_spend"] = 3] = "negative_spend";
    ProcessResult[ProcessResult["fork"] = 4] = "fork";
    ProcessResult[ProcessResult["unreceivable"] = 5] = "unreceivable";
    ProcessResult[ProcessResult["gap_previous"] = 6] = "gap_previous";
    ProcessResult[ProcessResult["gap_source"] = 7] = "gap_source";
    ProcessResult[ProcessResult["opened_burn_account"] = 8] = "opened_burn_account";
    ProcessResult[ProcessResult["balance_mismatch"] = 9] = "balance_mismatch";
    ProcessResult[ProcessResult["representative_mismatch"] = 10] = "representative_mismatch";
    ProcessResult[ProcessResult["block_position"] = 11] = "block_position"; // This block cannot follow the previous block
})(ProcessResult = exports.ProcessResult || (exports.ProcessResult = {}));
var SignatureVerification;
(function (SignatureVerification) {
    SignatureVerification[SignatureVerification["unknown"] = 0] = "unknown";
    SignatureVerification[SignatureVerification["invalid"] = 1] = "invalid";
    SignatureVerification[SignatureVerification["valid"] = 2] = "valid";
    SignatureVerification[SignatureVerification["valid_epoch"] = 3] = "valid_epoch"; // Valid for epoch blocks
})(SignatureVerification = exports.SignatureVerification || (exports.SignatureVerification = {}));
var NetworkParams = /** @class */ (function () {
    function NetworkParams() {
    }
    NetworkParams.headerMagicNumber = new UInt16_1.default({ buffer: Buffer.alloc(2) }); // FIXME
    return NetworkParams;
}());
exports.NetworkParams = NetworkParams;
//# sourceMappingURL=Common.js.map