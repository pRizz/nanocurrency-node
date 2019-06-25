import {Serializable} from '../src/node/Socket'
import * as assert from 'assert'
import {bufferFromSerializable} from '../src/node/Common'

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
})
