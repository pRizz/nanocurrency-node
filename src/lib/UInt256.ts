const blakejs = require('blakejs')

const nanoAlphabet = '13456789abcdefghijkmnopqrstuwxyz'

export default class UInt256 {
    number: Buffer = Buffer.alloc(32)

    constructor(props: any) {
        if(!props) {
            return
        }

        if(props.hex) {
            this.number = Buffer.from(props.hex, 'hex')
            return
        }
    }

    toAccount(): string {
        const checksum = blakejs.blake2b(this.number, null, 5).reverse()
        const bufferWithChecksum = Buffer.concat([this.number, checksum])
        const encodedCharacterArray = []
        const bitsToExtract = 5
        const lowest5BitsMask = 0x1f
        let usableBitCount = 0
        let lowestBits = 0

        for(let i = 0; i < bufferWithChecksum.length; ++i) {
            lowestBits |= bufferWithChecksum.readUInt8(bufferWithChecksum.length - 1 - i) << usableBitCount
            usableBitCount += 8
            while(usableBitCount >= bitsToExtract) {
                const encodedCharacter = nanoAlphabet[lowestBits & lowest5BitsMask]
                encodedCharacterArray.unshift(encodedCharacter)
                lowestBits >>>= bitsToExtract
                usableBitCount -= bitsToExtract
            }
        }

        if(usableBitCount >= 1) {
            const encodedCharacter = nanoAlphabet[lowestBits & lowest5BitsMask]
            encodedCharacterArray.unshift(encodedCharacter)
        }

        const encodedString = `nano_${encodedCharacterArray.join('')}`
        return encodedString
    }
}
