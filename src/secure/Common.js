"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../lib/Account");
var UInt16_1 = require("../lib/UInt16");
var Config_1 = require("../lib/Config");
var Numbers_1 = require("../lib/Numbers");
var nacl = require("tweetnacl");
var UInt256_1 = require("../lib/UInt256");
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
var KeyPair = /** @class */ (function () {
    function KeyPair(privateKey, publicKey) {
        this.privateKey = privateKey;
        if (publicKey) {
            this.publicKey = publicKey;
        }
        else {
            this.publicKey = new Numbers_1.PublicKey(new UInt256_1.default({
                uint8Array: nacl.sign.keyPair.fromSecretKey(privateKey.value.asUint8Array()).publicKey
            }));
        }
    }
    KeyPair.createZeroKeyPair = function () {
        var rawKey = new Numbers_1.RawKey(new UInt256_1.default({
            buffer: Buffer.alloc(32)
        }));
        return new KeyPair(rawKey);
    };
    return KeyPair;
}());
exports.KeyPair = KeyPair;
var LedgerConstants = /** @class */ (function () {
    function LedgerConstants(nanoNetwork) {
        this.genesisAccount = LedgerConstants.genesisAccountForNANONetwork(nanoNetwork);
    }
    /*
    *
    nano::keypair test_genesis_key;
    std::string nano_test_genesis;
    std::string nano_beta_genesis;
    std::string nano_live_genesis;
    std::string genesis_block;
    nano::uint128_t genesis_amount;
    nano::account burn_account;
    * */
    LedgerConstants.genesisAccountForNANONetwork = function (nanoNetwork) {
        switch (nanoNetwork) {
            case Config_1.NANONetwork.nanoLiveNetwork: return LedgerConstants.nanoLiveAccount;
            case Config_1.NANONetwork.nanoBetaNetwork: return LedgerConstants.nanoBetaAccount;
            case Config_1.NANONetwork.nanoTestNetwork: return LedgerConstants.nanoTestAccount;
        }
    };
    LedgerConstants.nanoLiveAccount = Account_1.default.fromHex('E89208DD038FBB269987689621D52292AE9C35941A7484756ECCED92A65093BA');
    LedgerConstants.nanoBetaAccount = Account_1.default.fromHex('A59A47CC4F593E75AE9AD653FDA9358E2F7898D9ACC8C60E80D0495CE20FBA9F');
    LedgerConstants.nanoTestAccount = Account_1.default.fromHex('B0311EA55708D6A53C75CDBF88300259C6D018522FE3D4D0A242E431F9E8B6D0');
    LedgerConstants.burnAccount = Account_1.default.fromHex('0000000000000000000000000000000000000000000000000000000000000000');
    LedgerConstants.zeroKey = KeyPair.createZeroKeyPair();
    return LedgerConstants;
}());
exports.LedgerConstants = LedgerConstants;
var NetworkParams = /** @class */ (function () {
    function NetworkParams(nanoNetwork, ledgerConstants) {
        if (nanoNetwork === void 0) { nanoNetwork = Config_1.NANONetwork.nanoLiveNetwork; }
        if (ledgerConstants === void 0) { ledgerConstants = new LedgerConstants(nanoNetwork); }
        this.nanoNetwork = nanoNetwork;
        this.ledgerConstants = ledgerConstants;
        this.headerMagicNumber = NetworkParams.headerMagicNumberForNetwork(nanoNetwork);
    }
    NetworkParams.headerMagicNumberForNetwork = function (nanoNetwork) {
        switch (nanoNetwork) {
            case Config_1.NANONetwork.nanoLiveNetwork:
                return new UInt16_1.default({
                    buffer: Buffer.from('RC', 'ascii')
                });
            case Config_1.NANONetwork.nanoBetaNetwork:
                return new UInt16_1.default({
                    buffer: Buffer.from('RB', 'ascii')
                });
            case Config_1.NANONetwork.nanoTestNetwork:
                return new UInt16_1.default({
                    buffer: Buffer.from('RA', 'ascii')
                });
        }
    };
    return NetworkParams;
}());
exports.NetworkParams = NetworkParams;
//# sourceMappingURL=Common.js.map