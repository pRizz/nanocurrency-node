import BlockHash from "./BlockHash";
import Account from "./Account";
import Work from "./Work";
import UInt64 from "./UInt64";
import UInt256 from "./UInt256";
import CurrencyAmount from "./CurrencyAmount";
import {NanoSignature} from '../node/Signatures'
const blakejs = require('blakejs')

//TODO: consider memoizing all hashing functions to speed up the BlockProcessor

interface SendBlockHashables {
    previousBlockHash: BlockHash
    destinationAccount: Account
    balance: CurrencyAmount
}

// TODO: Test
function produceSendBlockHash(sendBlockHashables: SendBlockHashables): BlockHash {
    const hashContext = blakejs.blake2bInit(32)
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.previousBlockHash.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.destinationAccount.publicKey.asUint8Array())
    blakejs.blake2bUpdate(hashContext, sendBlockHashables.balance.value.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new BlockHash(new UInt256({ uint8Array: result }))
}


interface ReceiveBlockHashables {
    previousBlockHash: BlockHash
    sourceBlockHash: BlockHash
}

// TODO: Test
function produceReceiveBlockHash(receiveBlockHashables: ReceiveBlockHashables): BlockHash {
    const hashContext = blakejs.blake2bInit(32)
    blakejs.blake2bUpdate(hashContext, receiveBlockHashables.previousBlockHash.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, receiveBlockHashables.sourceBlockHash.value.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new BlockHash(new UInt256({ uint8Array: result }))
}

interface OpenBlockHashables {
    sourceBlockHash: BlockHash
    representativeAccount: Account
    account: Account
}

// TODO: Test
function produceOpenBlockHash(openBlockHashables: OpenBlockHashables): BlockHash {
    const hashContext = blakejs.blake2bInit(32)
    blakejs.blake2bUpdate(hashContext, openBlockHashables.sourceBlockHash.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, openBlockHashables.representativeAccount.publicKey.asUint8Array())
    blakejs.blake2bUpdate(hashContext, openBlockHashables.account.publicKey.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new BlockHash(new UInt256({ uint8Array: result }))
}

interface ChangeBlockHashables {
    previousBlockHash: BlockHash
    representativeAccount: Account
}

// TODO: Test
function produceChangeBlockHash(changeBlockHashables: ChangeBlockHashables): BlockHash {
    const hashContext = blakejs.blake2bInit(32)
    blakejs.blake2bUpdate(hashContext, changeBlockHashables.previousBlockHash.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, changeBlockHashables.representativeAccount.publicKey.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new BlockHash(new UInt256({ uint8Array: result }))
}

interface StateBlockHashables {
    account: Account
    previousBlockHash: BlockHash
    representativeAccount: Account
    balance: CurrencyAmount
    // Link field contains source block_hash if receiving, destination account if sending
    link: UInt256
}

// TODO: Test
function produceStateBlockHash(stateBlockHashables: StateBlockHashables): BlockHash {
    const hashContext = blakejs.blake2bInit(32)
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.account.publicKey.asUint8Array())
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.previousBlockHash.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.representativeAccount.publicKey.asUint8Array())
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.balance.value.asUint8Array())
    blakejs.blake2bUpdate(hashContext, stateBlockHashables.link.asUint8Array())
    const result = blakejs.blake2bFinal(hashContext).reverse()
    return new BlockHash(new UInt256({ uint8Array: result }))
}

export enum BlockType {
    invalid = 0,
    not_a_block = 1,
    send = 2,
    receive = 3,
    open = 4,
    change = 5,
    state = 6
}

export default interface Block {
    getHash(): BlockHash
    getFullHash(): BlockHash
    toJSON(): string
    getWork(): Work
    getAccount(): Account
    getPreviousHash(): BlockHash
    getSourceHash(): BlockHash
    getRootHash(): BlockHash
    getBlockType(): BlockType
    getBlockSignature(): NanoSignature
    getLink(): BlockHash

    /**
     virtual nano::account account () const;
     // Previous block in account's chain, zero for open block
     virtual nano::block_hash previous () const = 0;
     // Source block for open/receive blocks, zero otherwise.
     virtual nano::block_hash source () const;
     // Previous block or account number for open blocks
     virtual nano::block_hash root () const = 0;
     // Qualified root value based on previous() and root()
     virtual nano::qualified_root qualified_root () const;
     // Link field for state blocks, zero otherwise.
     virtual nano::account representative () const;
     virtual void serialize (nano::stream &) const = 0;
     virtual void serialize_json (std::string &) const = 0;
     virtual void serialize_json (boost::property_tree::ptree &) const = 0;
     virtual void visit (nano::block_visitor &) const = 0;
     virtual bool operator== (nano::block const &) const = 0;
     virtual void signature_set (nano::uint512_union const &) = 0;
     virtual ~block () = default;
     virtual bool valid_predecessor (nano::block const &) const = 0;
     static size_t size (nano::block_type);
     */
}
