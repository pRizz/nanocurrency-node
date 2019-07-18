import {NetworkConstants} from '../lib/Config'
import ipaddr = require('ipaddr.js');

namespace NANOWebSocket {
    export class Config {
        readonly networkConstants = new NetworkConstants()
        private port: number
        private isEnabled = false
        private ipAddress = ipaddr.IPv6.parse('::1')

        constructor() {
            this.port = this.networkConstants.defaultWebSocketPort
        }

        getIsEnabled(): boolean {
            return this.isEnabled
        }

        getPort(): number {
            return this.port
        }

        getIPAddress(): ipaddr.IPv6 {
            return this.ipAddress
        }
    }
}

export default NANOWebSocket
