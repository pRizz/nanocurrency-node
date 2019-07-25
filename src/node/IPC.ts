interface Transport {
    stop(): void
}

export default class IPCServer {
    private readonly transports = new Array<Transport>()
    private readonly isTransportDomainEnabled: boolean
    private readonly isTransportTCPEnabled: boolean

    constructor(isTransportDomainEnabled: boolean, isTransportTCPEnabled: boolean) {
        this.isTransportDomainEnabled = isTransportDomainEnabled
        this.isTransportTCPEnabled = isTransportTCPEnabled

        throw 0 // FIXME
    }

    stop() {
        for(const transport of this.transports) {
            transport.stop()
        }
    }
}
