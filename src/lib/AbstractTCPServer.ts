/**
 * Implements connection handling and error handling in an abstract way.
 * Intended to allow for the NANO protocol based TCP messages to be injected
 * and handled in an abstract way. Emits events.
 *
 * This class should be extensible enough to even allow HTTP methods/messages
 * to be injected and handled in a similarly clean way.
 *
 * TODO: allow for a more abstract server that can be run over different lower
 * level protocols like UDP.
 *
 * Invariants:
 * - listens to a certain port
 * - accepts new connections
 * */
import {Socket} from 'net'


/// like GET, POST, KeepliveMessage
type MessageTypeName = string

type MessageRecognizedCallback = (messageName: MessageTypeName, data: Buffer) => void
type MessageHandler = (messageName: MessageTypeName, data: Buffer) => void

interface AbstractTCPMessage {
    name: MessageTypeName
    data: Buffer
}

interface AbstractTCPServerMessageDefinition {
    name: MessageTypeName
    messageHandler: MessageHandler
}

interface TCPServerEventListener {
    onError: () => void
}

interface AbstractTCPServerProps {
    port: number
    messageDefinitions: AbstractTCPServerMessageDefinition[]
    eventListener: TCPServerEventListener
    messageNameSet: Set<MessageTypeName>
    messageRecognizer: (stream: Socket, messageReceivedCallback: (messageName: MessageTypeName, data: Buffer) => void) => void
    // messageFromBuffer: (buffer: Buffer) => AbstractTCPServerMessageDefinition
}

export class AbstractTCPServer {
    constructor(props: AbstractTCPServerProps) {
    }

    start() {
        // maybe the server should emit Session objects when an entity connects
        // the session should have internal input and output streams that send bytes,
        // but these streams should be abstracted and sending and receiving messages
    }

    stop() {

    }
}
