import * as assert from 'assert'
import {MessageHeader, MessageType} from '../src/node/Common'
import UInt8 from '../src/lib/UInt8'
import UInt16 from '../src/lib/UInt16'
import {PassThrough, Readable, Writable} from 'stream'
import {NetworkParams} from '../src/secure/Common'
import * as fs from 'fs'

describe('MessageParser', () => {
    describe('#deserialize()',() => {
        it('should deserialize the message from binary', async () => {
            const binaryFile = await fs.promises.readFile('test/testFiles/2020-12-24T17:35:26.895Z.SendHandshakeTest.bin')
            console.log(`bin`, binaryFile)

            // FIXME
            // const messageHeader = new MessageHeader(
            //     MessageType.confirm_req,
            //     new UInt16({ octetArray: [0x05, 0x06]}),
            //     new UInt8({ octetArray: [0x01]}),
            //     new UInt8({ octetArray: [0x02]}),
            //     new UInt8({ octetArray: [0x03]}),
            // )

            // let actualBuffer = Buffer.alloc(0)
            //
            // const writable = new Writable({
            //     write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
            //         actualBuffer = Buffer.concat([actualBuffer, chunk as Buffer])
            //         callback()
            //     }
            // })

            // messageHeader.serialize(writable)
            //
            // const expectedBuffer = Buffer.concat([
            //     NetworkParams.getHeaderMagicNumber().asBuffer(),
            //     Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            // ])

            // assert(actualBuffer.equals(expectedBuffer))
        })
    })

})
