
import UInt256 from '../src/lib/UInt256'
import UInt64 from '../src/lib/UInt64'
import * as assert from 'assert'
import WorkValidator from '../src/lib/WorkValidator'

describe('WorkValidator', () => {
    describe('#validate()', () => {
        it('should validate work', () => {
            const blockHash = new UInt256({
                hex: '60E6F8E0017F59C8CE5447C1F1E951CAD302661DC40E44C4ECEA2F7F835D3E7B'
            })
            const work = new UInt64({
                hex: 'CB376DF467B7270C'
            })
            assert(WorkValidator.isWorkValid(blockHash, work))
        })
    })
})
