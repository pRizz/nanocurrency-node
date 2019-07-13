import {Serializable} from '../src/node/Socket'
import * as assert from 'assert'
import {bufferFromSerializable, Equatable, IPAddress, UDPEndpoint} from '../src/node/Common'
import ipaddr = require('ipaddr.js');

describe('Common', () => {
    describe('#bufferFromSerializable()', () => {
        it('should create a buffer from a serializable', async () => {
            const inputBuffer = Buffer.from([0x01, 0x02])
            const serializable: Serializable = {
                serialize(stream: NodeJS.WritableStream): void {
                    stream.write(inputBuffer)
                }
            }

            const outputBuffer = await bufferFromSerializable(serializable)

            assert(inputBuffer.equals(outputBuffer))
        })
    })

    describe('UDPEndpoint#toDBBuffer()', () => {
        it('should create a DB buffer from a UDPEndpoint', async () => {
            const ipv6 = ipaddr.IPv6.parse('1::1')
            const ip = new IPAddress(ipv6)
            const udpEndpoint = new UDPEndpoint(ip, 10)

            const udpDBBuffer = udpEndpoint.toDBBuffer()
            assert(Buffer.from('00010000000000000000000000000001000a', 'hex').equals(udpDBBuffer))
        })
    })

    describe('UDPEndpoint#fromDB()', () => {
        it('should create a UDPEndpoint from a DB buffer', async () => {
            const udpEndpoint = UDPEndpoint.fromDB(Buffer.from('00ff00000000000000000000000000ab0019', 'hex'))

            const ipv6 = ipaddr.IPv6.parse('ff::ab')
            const ip = new IPAddress(ipv6)
            const expectedUDPEndpoint = new UDPEndpoint(ip, 25)

            assert(udpEndpoint.equals(expectedUDPEndpoint))
        })
    })
})

