export interface ServerPlugin {
    // this can be wire interface agnostic
    // as long as it can generate a bitstream and stuff?

    start(): Promise<void>
    stop(): Promise<void>
}
