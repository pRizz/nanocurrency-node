import Account from "../lib/Account";
import CurrencyAmount from "../lib/CurrencyAmount";
import Block from "../lib/Block";
import UInt16 from '../lib/UInt16'
import {Moment} from 'moment'
import {NANONetwork, NetworkConstants} from '../lib/Config'
import {PublicKey, RawKey} from '../lib/Numbers'
import * as nacl from 'tweetnacl'
import UInt256 from '../lib/UInt256'

interface UncheckedInfoProps {
    readonly block: Block
    readonly account?: Account
    readonly modified: Moment
    readonly signatureVerification: SignatureVerification
}

export class UncheckedInfo {
    readonly block: Block
    readonly account?: Account
    readonly modified: Moment
    readonly signatureVerification: SignatureVerification

    constructor(props: UncheckedInfoProps) {
        this.block = props.block
        this.account = props.account
        this.modified = props.modified
        this.signatureVerification = props.signatureVerification
    }
}

export class ProcessReturn {
    processResult: ProcessResult
    account: Account
    amount: CurrencyAmount
    pendingAccount: Account
    stateIsSend: boolean | null
    signatureVerification: SignatureVerification
}

export enum ProcessResult {
    progress, // Hasn't been seen before, signed correctly
    bad_signature, // Signature was bad, forged or transmission error
    old, // Already seen and was valid
    negative_spend, // Malicious attempt to spend a negative amount
    fork, // Malicious fork based on previous
    unreceivable, // Source block doesn't exist, has already been received, or requires an account upgrade (epoch blocks)
    gap_previous, // Block marked as previous is unknown
    gap_source, // Block marked as source is unknown
    opened_burn_account, // The impossible happened, someone found the private key associated with the public key '0'.
    balance_mismatch, // Balance and amount delta don't match
    representative_mismatch, // Representative is changed when it is not allowed
    block_position // This block cannot follow the previous block
}

export enum SignatureVerification {
    unknown = 0,
    invalid = 1,
    valid = 2,
    valid_epoch = 3 // Valid for epoch blocks
}

export class KeyPair {
    readonly publicKey: PublicKey

    constructor(readonly privateKey: RawKey, publicKey?: PublicKey) {
        if(publicKey) {
            this.publicKey = publicKey
        } else {
            this.publicKey = new PublicKey(new UInt256({
                uint8Array: nacl.sign.keyPair.fromSecretKey(privateKey.value.asUint8Array()).publicKey
            }))
        }
    }

    static createZeroKeyPair() {
        const rawKey = new RawKey(new UInt256({
            buffer: Buffer.alloc(32)
        }))
        return new KeyPair(rawKey)
    }
}

export class LedgerConstants {

    static readonly nanoLiveAccount = Account.fromHex('E89208DD038FBB269987689621D52292AE9C35941A7484756ECCED92A65093BA')
    static readonly nanoBetaAccount = Account.fromHex('A59A47CC4F593E75AE9AD653FDA9358E2F7898D9ACC8C60E80D0495CE20FBA9F')
    static readonly nanoTestAccount = Account.fromHex('B0311EA55708D6A53C75CDBF88300259C6D018522FE3D4D0A242E431F9E8B6D0')
    static readonly burnAccount = Account.fromHex('0000000000000000000000000000000000000000000000000000000000000000')

    static readonly zeroKey = KeyPair.createZeroKeyPair()

    readonly genesisAccount: Account

    /*
    *
    nano::keypair test_genesis_key;
    std::string nano_test_genesis;
    std::string nano_beta_genesis;
    std::string nano_live_genesis;
    std::string genesis_block;
    nano::uint128_t genesis_amount;
    nano::account burn_account;
    * */

    private static genesisAccountForNANONetwork(nanoNetwork: NANONetwork): Account {
        switch (nanoNetwork) {
            case NANONetwork.nanoLiveNetwork: return LedgerConstants.nanoLiveAccount
            case NANONetwork.nanoBetaNetwork: return LedgerConstants.nanoBetaAccount
            case NANONetwork.nanoTestNetwork: return LedgerConstants.nanoTestAccount
        }
    }

    constructor(nanoNetwork: NANONetwork) {
        this.genesisAccount = LedgerConstants.genesisAccountForNANONetwork(nanoNetwork)
    }
}

export class NetworkParams {
    static network: NetworkConstants

    readonly headerMagicNumber: UInt16

    private static headerMagicNumberForNetwork(nanoNetwork: NANONetwork): UInt16 {
        switch (nanoNetwork) {
            case NANONetwork.nanoLiveNetwork:
                return new UInt16({
                    buffer: Buffer.from('RC', 'ascii')
                })
            case NANONetwork.nanoBetaNetwork:
                return new UInt16({
                    buffer: Buffer.from('RB', 'ascii')
                })
            case NANONetwork.nanoTestNetwork:
                return new UInt16({
                    buffer: Buffer.from('RA', 'ascii')
                })
        }
    }

    constructor(
        readonly nanoNetwork: NANONetwork = NANONetwork.nanoLiveNetwork,
        readonly ledgerConstants: LedgerConstants = new LedgerConstants(nanoNetwork)
    ) {
        this.headerMagicNumber = NetworkParams.headerMagicNumberForNetwork(nanoNetwork)
    }
}
