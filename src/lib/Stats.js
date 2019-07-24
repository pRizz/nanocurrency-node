"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatType;
(function (StatType) {
    StatType[StatType["traffic"] = 0] = "traffic";
    StatType[StatType["traffic_tcp"] = 1] = "traffic_tcp";
    StatType[StatType["error"] = 2] = "error";
    StatType[StatType["message"] = 3] = "message";
    StatType[StatType["block"] = 4] = "block";
    StatType[StatType["ledger"] = 5] = "ledger";
    StatType[StatType["rollback"] = 6] = "rollback";
    StatType[StatType["bootstrap"] = 7] = "bootstrap";
    StatType[StatType["vote"] = 8] = "vote";
    StatType[StatType["http_callback"] = 9] = "http_callback";
    StatType[StatType["peering"] = 10] = "peering";
    StatType[StatType["ipc"] = 11] = "ipc";
    StatType[StatType["tcp"] = 12] = "tcp";
    StatType[StatType["udp"] = 13] = "udp";
    StatType[StatType["confirmation_height"] = 14] = "confirmation_height";
    StatType[StatType["drop"] = 15] = "drop";
})(StatType = exports.StatType || (exports.StatType = {}));
var StatDetail;
(function (StatDetail) {
    StatDetail[StatDetail["all"] = 0] = "all";
    // error specific
    StatDetail[StatDetail["bad_sender"] = 1] = "bad_sender";
    StatDetail[StatDetail["insufficient_work"] = 2] = "insufficient_work";
    StatDetail[StatDetail["http_callback"] = 3] = "http_callback";
    StatDetail[StatDetail["unreachable_host"] = 4] = "unreachable_host";
    // ledger, block, bootstrap
    StatDetail[StatDetail["send"] = 5] = "send";
    StatDetail[StatDetail["receive"] = 6] = "receive";
    StatDetail[StatDetail["open"] = 7] = "open";
    StatDetail[StatDetail["change"] = 8] = "change";
    StatDetail[StatDetail["state_block"] = 9] = "state_block";
    StatDetail[StatDetail["epoch_block"] = 10] = "epoch_block";
    StatDetail[StatDetail["fork"] = 11] = "fork";
    // message specific
    StatDetail[StatDetail["keepalive"] = 12] = "keepalive";
    StatDetail[StatDetail["publish"] = 13] = "publish";
    StatDetail[StatDetail["republish_vote"] = 14] = "republish_vote";
    StatDetail[StatDetail["confirm_req"] = 15] = "confirm_req";
    StatDetail[StatDetail["confirm_ack"] = 16] = "confirm_ack";
    StatDetail[StatDetail["node_id_handshake"] = 17] = "node_id_handshake";
    // bootstrap, callback
    StatDetail[StatDetail["initiate"] = 18] = "initiate";
    StatDetail[StatDetail["initiate_lazy"] = 19] = "initiate_lazy";
    StatDetail[StatDetail["initiate_wallet_lazy"] = 20] = "initiate_wallet_lazy";
    // bootstrap specific
    StatDetail[StatDetail["bulk_pull"] = 21] = "bulk_pull";
    StatDetail[StatDetail["bulk_pull_account"] = 22] = "bulk_pull_account";
    StatDetail[StatDetail["bulk_pull_deserialize_receive_block"] = 23] = "bulk_pull_deserialize_receive_block";
    StatDetail[StatDetail["bulk_pull_error_starting_request"] = 24] = "bulk_pull_error_starting_request";
    StatDetail[StatDetail["bulk_pull_failed_account"] = 25] = "bulk_pull_failed_account";
    StatDetail[StatDetail["bulk_pull_receive_block_failure"] = 26] = "bulk_pull_receive_block_failure";
    StatDetail[StatDetail["bulk_pull_request_failure"] = 27] = "bulk_pull_request_failure";
    StatDetail[StatDetail["bulk_push"] = 28] = "bulk_push";
    StatDetail[StatDetail["frontier_req"] = 29] = "frontier_req";
    StatDetail[StatDetail["error_socket_close"] = 30] = "error_socket_close";
    // vote specific
    StatDetail[StatDetail["vote_valid"] = 31] = "vote_valid";
    StatDetail[StatDetail["vote_replay"] = 32] = "vote_replay";
    StatDetail[StatDetail["vote_invalid"] = 33] = "vote_invalid";
    StatDetail[StatDetail["vote_overflow"] = 34] = "vote_overflow";
    // udp
    StatDetail[StatDetail["blocking"] = 35] = "blocking";
    StatDetail[StatDetail["overflow"] = 36] = "overflow";
    StatDetail[StatDetail["invalid_magic"] = 37] = "invalid_magic";
    StatDetail[StatDetail["invalid_network"] = 38] = "invalid_network";
    StatDetail[StatDetail["invalid_header"] = 39] = "invalid_header";
    StatDetail[StatDetail["invalid_message_type"] = 40] = "invalid_message_type";
    StatDetail[StatDetail["invalid_keepalive_message"] = 41] = "invalid_keepalive_message";
    StatDetail[StatDetail["invalid_publish_message"] = 42] = "invalid_publish_message";
    StatDetail[StatDetail["invalid_confirm_req_message"] = 43] = "invalid_confirm_req_message";
    StatDetail[StatDetail["invalid_confirm_ack_message"] = 44] = "invalid_confirm_ack_message";
    StatDetail[StatDetail["invalid_node_id_handshake_message"] = 45] = "invalid_node_id_handshake_message";
    StatDetail[StatDetail["outdated_version"] = 46] = "outdated_version";
    // tcp
    StatDetail[StatDetail["tcp_accept_success"] = 47] = "tcp_accept_success";
    StatDetail[StatDetail["tcp_accept_failure"] = 48] = "tcp_accept_failure";
    StatDetail[StatDetail["tcp_write_drop"] = 49] = "tcp_write_drop";
    // ipc
    StatDetail[StatDetail["invocations"] = 50] = "invocations";
    // peering
    StatDetail[StatDetail["handshake"] = 51] = "handshake";
    // confirmation height
    StatDetail[StatDetail["blocks_confirmed"] = 52] = "blocks_confirmed";
    StatDetail[StatDetail["invalid_block"] = 53] = "invalid_block";
})(StatDetail = exports.StatDetail || (exports.StatDetail = {}));
var StatDirection;
(function (StatDirection) {
    StatDirection[StatDirection["in"] = 0] = "in";
    StatDirection[StatDirection["out"] = 1] = "out";
})(StatDirection = exports.StatDirection || (exports.StatDirection = {}));
var Stat = /** @class */ (function () {
    function Stat() {
    }
    Stat.prototype.stop = function () {
        // TODO
    };
    return Stat;
}());
exports.Stat = Stat;
//# sourceMappingURL=Stats.js.map