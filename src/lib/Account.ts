import UInt256 from "./UInt256";
const blakejs = require('blakejs')

const nanoAlphabet = '13456789abcdefghijkmnopqrstuwxyz'

export default class Account {
    readonly publicKey: UInt256
    private computedAddress: string

    static fromPublicKeyHex(hex: string): Account {
        return new Account(new UInt256({ hex }))
    }

    constructor(publicKey: UInt256) {
        this.publicKey = publicKey
    }

    isZero(): boolean {
        return this.publicKey.isZero()
    }

    equals(other: Account): boolean {
        return this.publicKey.equals(other.publicKey)
    }

    toNANOAddress(): string {
        if(this.computedAddress) {
            return this.computedAddress
        }

        const checksum = blakejs.blake2b(this.publicKey.asBuffer(), null, 5).reverse()
        const bufferWithChecksum = Buffer.concat([this.publicKey.asBuffer(), checksum])
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
        this.computedAddress = encodedString
        return encodedString
    }
}
