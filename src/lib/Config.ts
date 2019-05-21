import UInt64 from './UInt64'

const publishTestThresholdHex = 'ff00000000000000'
const publishFullThresholdHex = 'ffffffc000000000'

export default class Config {
    static publishThreshold: UInt64 = new UInt64({ hex: publishFullThresholdHex })
}
