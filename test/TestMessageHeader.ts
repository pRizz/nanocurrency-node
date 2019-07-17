import * as assert from 'assert'
import {MessageHeader, MessageType} from '../src/node/Common'
import UInt8 from '../src/lib/UInt8'
import UInt16 from '../src/lib/UInt16'
import {PassThrough, Readable, Writable} from 'stream'
import {NetworkParams} from '../src/secure/Common'

describe('MessageHeader', () => {
    describe('#serialize()',() => {
        it('should serialize the message header to the stream', async () => {
            const messageHeader = new MessageHeader(
                MessageType.confirm_req,
                new UInt16({ octetArray: [0x05, 0x06]}),
                new UInt8({ octetArray: [0x01]}),
                new UInt8({ octetArray: [0x02]}),
                new UInt8({ octetArray: [0x03]}),
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
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            ])

            assert(actualBuffer.equals(expectedBuffer))
        })
    })

    describe('#from()',() => {
        it('should create the message header from the stream', async () => {
            const streamBuffer = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            ])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer)

            const messageHeader = await MessageHeader.from(messageStream)

            const expectedMessageHeader = new MessageHeader(
                MessageType.confirm_req,
                new UInt16({ octetArray: [0x05, 0x06]}),
                new UInt8({ octetArray: [0x01]}),
                new UInt8({ octetArray: [0x02]}),
                new UInt8({ octetArray: [0x03]}),
            )

            assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax))
            assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing))
            assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin))
            assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType)
            assert(messageHeader.extensions.equals(expectedMessageHeader.extensions))
        })

        it('should create the message header from the stream asynchronously on UInt8 boundary', async () => {
            const streamBuffer1 = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03])
            ])

            const streamBuffer2 = Buffer.concat([
                Buffer.from([0x04, 0x05, 0x06])
            ])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer1)

            setTimeout(() => { messageStream.write(streamBuffer2) }, 5)

            const messageHeader = await MessageHeader.from(messageStream)

            const expectedMessageHeader = new MessageHeader(
                MessageType.confirm_req,
                new UInt16({ octetArray: [0x05, 0x06]}),
                new UInt8({ octetArray: [0x01]}),
                new UInt8({ octetArray: [0x02]}),
                new UInt8({ octetArray: [0x03]}),
            )

            assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax))
            assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing))
            assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin))
            assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType)
            assert(messageHeader.extensions.equals(expectedMessageHeader.extensions))
        })

        it('should create the message header from the stream asynchronously on UInt16 boundary', async () => {
            const streamBuffer1 = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            ])

            const streamBuffer2 = Buffer.from([0x06])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer1)

            setTimeout(() => { messageStream.write(streamBuffer2) }, 5)

            const messageHeader = await MessageHeader.from(messageStream)

            const expectedMessageHeader = new MessageHeader(
                MessageType.confirm_req,
                new UInt16({ octetArray: [0x05, 0x06]}),
                new UInt8({ octetArray: [0x01]}),
                new UInt8({ octetArray: [0x02]}),
                new UInt8({ octetArray: [0x03]}),
            )

            assert(messageHeader.versionMax.equals(expectedMessageHeader.versionMax))
            assert(messageHeader.versionUsing.equals(expectedMessageHeader.versionUsing))
            assert(messageHeader.versionMin.equals(expectedMessageHeader.versionMin))
            assert.strictEqual(messageHeader.messageType, expectedMessageHeader.messageType)
            assert(messageHeader.extensions.equals(expectedMessageHeader.extensions))
        })

        it('should not create the message header from a short stream at UInt16 boundary', async () => {
            const invalidStreamBuffer = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            ])

            const messageStream = new PassThrough()
            messageStream.write(invalidStreamBuffer)
            messageStream.end()

            await assert.rejects(MessageHeader.from(messageStream))
        })

        it('should not create the message header after a timeout', async () => {
            const streamBuffer1 = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            ])

            const streamBuffer2 = Buffer.from([0x06])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer1)

            setTimeout(() => { messageStream.write(streamBuffer2) }, 20)

            await assert.rejects(MessageHeader.from(messageStream, 10))
        })

        it('should not create the message header after stream ends unexpectedly on UInt16 boundary', async () => {
            const streamBuffer = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            ])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer)

            setTimeout(() => { messageStream.end() }, 10)

            await assert.rejects(MessageHeader.from(messageStream))
        })

        it('should not create the message header after stream ends unexpectedly on UInt8 boundary', async () => {
            const streamBuffer = Buffer.concat([
                NetworkParams.getHeaderMagicNumber().asBuffer(),
                Buffer.from([0x01, 0x02, 0x03])
            ])

            const messageStream = new PassThrough()
            messageStream.write(streamBuffer)

            setTimeout(() => { messageStream.end() }, 10)

            await assert.rejects(MessageHeader.from(messageStream))
        })

        it('should not create the message header from an invalid magic number', async () => {
            const invalidStreamBuffer = Buffer.concat([
                Buffer.from([0xbe, 0xef]),
                Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            ])

            const messageStream = new PassThrough()
            messageStream.write(invalidStreamBuffer)

            await assert.rejects(MessageHeader.from(messageStream))
        })
    })
})
