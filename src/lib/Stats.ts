export enum StatType {
    traffic,
    traffic_tcp,
    error,
    message,
    block,
    ledger,
    rollback,
    bootstrap,
    vote,
    http_callback,
    peering,
    ipc,
    tcp,
    udp,
    confirmation_height,
    drop
}

export enum StatDetail {
    all = 0,

    // error specific
    bad_sender,
    insufficient_work,
    http_callback,
    unreachable_host,

    // ledger, block, bootstrap
    send,
    receive,
    open,
    change,
    state_block,
    epoch_block,
    fork,

    // message specific
    keepalive,
    publish,
    republish_vote,
    confirm_req,
    confirm_ack,
    node_id_handshake,

    // bootstrap, callback
    initiate,
    initiate_lazy,
    initiate_wallet_lazy,

    // bootstrap specific
    bulk_pull,
    bulk_pull_account,
    bulk_pull_deserialize_receive_block,
    bulk_pull_error_starting_request,
    bulk_pull_failed_account,
    bulk_pull_receive_block_failure,
    bulk_pull_request_failure,
    bulk_push,
    frontier_req,
    error_socket_close,

    // vote specific
    vote_valid,
    vote_replay,
    vote_invalid,
    vote_overflow,

    // udp
    blocking,
    overflow,
    invalid_magic,
    invalid_network,
    invalid_header,
    invalid_message_type,
    invalid_keepalive_message,
    invalid_publish_message,
    invalid_confirm_req_message,
    invalid_confirm_ack_message,
    invalid_node_id_handshake_message,
    outdated_version,

    // tcp
    tcp_accept_success,
    tcp_accept_failure,
    tcp_write_drop,

    // ipc
    invocations,

    // peering
    handshake,

    // confirmation height
    blocks_confirmed,
    invalid_block
}

export enum StatDirection {
    in,
    out
}

export class Stat {
    stop() {
        throw 0 // FIXME
    }
}
