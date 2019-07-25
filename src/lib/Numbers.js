"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Signature = /** @class */ (function () {
    function Signature(value) {
        this.value = value;
    }
    Signature.prototype.equals = function (other) {
        return this.value.equals(other.value);
    };
    return Signature;
}());
exports.Signature = Signature;
var QualifiedRoot = /** @class */ (function () {
    function QualifiedRoot(value) {
        this.value = value;
    }
    QualifiedRoot.prototype.equals = function (other) {
        return this.value.equals(other.value);
    };
    return QualifiedRoot;
}());
exports.QualifiedRoot = QualifiedRoot;
var PublicKey = /** @class */ (function () {
    function PublicKey(value) {
        this.value = value;
    }
    PublicKey.prototype.equals = function (other) {
        return this.value.equals(other.value);
    };
    return PublicKey;
}());
exports.PublicKey = PublicKey;
var RawKey = /** @class */ (function () {
    function RawKey(value) {
        this.value = value;
    }
    RawKey.prototype.decrypt = function () {
        throw 0; // FIXME
    };
    RawKey.prototype.equals = function (other) {
        return this.value.equals(other.value);
    };
    return RawKey;
}());
exports.RawKey = RawKey;
//# sourceMappingURL=Numbers.js.map