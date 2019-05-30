import Account from "../lib/Account";
import CurrencyAmount from "../lib/CurrencyAmount";

export class UncheckedInfo {

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
