"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UDPEndpoint = /** @class */ (function () {
    function UDPEndpoint() {
    }
    return UDPEndpoint;
}());
exports.UDPEndpoint = UDPEndpoint;
var TCPEndpoint = /** @class */ (function () {
    function TCPEndpoint() {
    }
    return TCPEndpoint;
}());
exports.TCPEndpoint = TCPEndpoint;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["invalid"] = 0] = "invalid";
    MessageType[MessageType["not_a_type"] = 1] = "not_a_type";
    MessageType[MessageType["keepalive"] = 2] = "keepalive";
    MessageType[MessageType["publish"] = 3] = "publish";
    MessageType[MessageType["confirm_req"] = 4] = "confirm_req";
    MessageType[MessageType["confirm_ack"] = 5] = "confirm_ack";
    MessageType[MessageType["bulk_pull"] = 6] = "bulk_pull";
    MessageType[MessageType["bulk_push"] = 7] = "bulk_push";
    MessageType[MessageType["frontier_req"] = 8] = "frontier_req";
    /* deleted 0x9 */
    MessageType[MessageType["node_id_handshake"] = 10] = "node_id_handshake";
    MessageType[MessageType["bulk_pull_account"] = 11] = "bulk_pull_account";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageHeader = /** @class */ (function () {
    function MessageHeader(messageType) {
        this.messageType = messageType;
    }
    return MessageHeader;
}());
exports.MessageHeader = MessageHeader;
var Stream = /** @class */ (function () {
    function Stream() {
    }
    return Stream;
}());
exports.Stream = Stream;
var KeepaliveMessage = /** @class */ (function () {
    function KeepaliveMessage(peers) {
        this.messageHeader = new MessageHeader(MessageType.keepalive);
        this.peers = peers;
    }
    KeepaliveMessage.prototype.serialize = function (stream) {
        //TODO
    };
    KeepaliveMessage.prototype.visit = function (messageVisitor) {
        //TODO
    };
    KeepaliveMessage.prototype.asBuffer = function () {
        return new Buffer(0); // FIXME
    };
    KeepaliveMessage.prototype.getPeers = function () {
        return this.peers;
    };
    KeepaliveMessage.prototype.getMessageHeader = function () {
        return this.messageHeader;
    };
    return KeepaliveMessage;
}());
exports.KeepaliveMessage = KeepaliveMessage;
//# sourceMappingURL=Common.js.map