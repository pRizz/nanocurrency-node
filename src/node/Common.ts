export class UDPEndpoint {

}

export class TCPEndpoint {

}

export interface Message {
    serialize(stream: Stream): void
    visit(messageVisitor: MessageVisitor): void
    asBuffer(): Buffer
    getMessageHeader(): MessageHeader
}

export enum MessageType {
    invalid = 0x0,
    not_a_type = 0x1,
    keepalive = 0x2,
    publish = 0x3,
    confirm_req = 0x4,
    confirm_ack = 0x5,
    bulk_pull = 0x6,
    bulk_push = 0x7,
    frontier_req = 0x8,
    /* deleted 0x9 */
    node_id_handshake = 0x0a,
    bulk_pull_account = 0x0b
}

export class MessageHeader {
    readonly messageType: MessageType
    constructor(messageType: MessageType) {
        this.messageType = messageType
    }
}

export class Stream {

}

export interface MessageVisitor {

}

export class KeepaliveMessage implements Message {
    private messageHeader = new MessageHeader(MessageType.keepalive)
    private readonly peers: Set<UDPEndpoint>

    constructor(peers: Set<UDPEndpoint>) {
        this.peers = peers
    }

    serialize(stream: Stream): void {
        //TODO
    }

    visit(messageVisitor: MessageVisitor): void {
        //TODO
    }

    asBuffer(): Buffer {
        return new Buffer(0) // FIXME
    }

    getPeers(): Set<UDPEndpoint> {
        return this.peers
    }

    getMessageHeader(): MessageHeader {
        return this.messageHeader
    }
}
