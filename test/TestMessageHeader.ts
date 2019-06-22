import * as assert from 'assert'
import {MessageHeader, MessageType} from '../src/node/Common'
import UInt8 from '../src/lib/UInt8'
import UInt16 from '../src/lib/UInt16'
import {Writable} from 'stream'
import {NetworkParams} from '../src/secure/Common'

describe('MessageHeader', () => {
    describe('#serialize()',() => {
        it('should serialize the message header to the stream', async () => {
            const messageHeader = new MessageHeader(
                new UInt8({ octetArray: [0x01]}),
                new UInt8({ octetArray: [0x02]}),
                new UInt8({ octetArray: [0x03]}),
                MessageType.confirm_req,
                new UInt16({ octetArray: [0x05, 0x06]}),
            )

            let actualBuffer = Buffer.alloc(0)

            const writable = new Writable({
                write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
                    actualBuffer = Buffer.concat([actualBuffer, chunk as Buffer])
                    callback()
                }
            })

            messageHeader.serialize(writable)

            const expectedBuffer = Buffer.concat([
                NetworkParams.headerMagicNumber.asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            ])

            assert(actualBuffer.equals(expectedBuffer))
        })
    })
})
