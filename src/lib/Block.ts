import BlockHash from "./BlockHash";

export default interface Block {
    getHash(): BlockHash
    getFullHash(): BlockHash
    toJSON(): string


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
     virtual nano::block_hash link () const;
     virtual nano::account representative () const;
     virtual void serialize (nano::stream &) const = 0;
     virtual void serialize_json (std::string &) const = 0;
     virtual void serialize_json (boost::property_tree::ptree &) const = 0;
     virtual void visit (nano::block_visitor &) const = 0;
     virtual bool operator== (nano::block const &) const = 0;
     virtual nano::block_type type () const = 0;
     virtual nano::signature block_signature () const = 0;
     virtual void signature_set (nano::uint512_union const &) = 0;
     virtual ~block () = default;
     virtual bool valid_predecessor (nano::block const &) const = 0;
     static size_t size (nano::block_type);
     */
}
