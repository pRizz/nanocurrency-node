# High Level Protocol

This document describes the NANO protocol at a high level to the best of my (Peter Ryszkiewicz) understanding.
There may be logical or business rule errors in this document, so take with a grain of salt. I am
gleaning all information by reading and comprehending the main NANO node repo written in C++
[https://github.com/nanocurrency/nano-node](https://github.com/nanocurrency/nano-node)

## Architecture

The node software may be composed as a collection of separate modules that may interact with one another. My goal is to reduce coupling and emphasize KISS, DRY, and composition. If this is properly achieved, then it will be not only possible, but easy to build around the node software other modules, such as a wallet, logging, or plugins. Also the ability to simply install via npm/npx/yarn and port to WebAssembly.

At the root, I will create an app that has a similar architecture to Component, or Mount, from the Clojure world, where app state is managed at the highest level, and components may be independently and safely started and stopped as desired. https://github.com/tolitius/mount/blob/master/doc/differences-from-component.md

Here are a list of separate services that the app can be composed of:
- a NANO server: this interacts with and manages the connections between nodes over TCP/UDP. I am curious to create a new WebSocket interface which should simplify some connection management tasks of TCP/UDP.
- a ledger service:
  - accepts and integrates new blocks
  - emits new blocks
  - stores blocks in an independent manner

By decoupling these services, it is possible in the future to have a NANO node run over HTTP(S), or Bluetooth, and for the ledger to be stored in different types of data stores such as IndexedDB, SQL, NoSQL, or in memory.

Here is a list of pure functional modules:
- a message parser
- work/pow validators and generators
- message signing, hashing  

It is my goal for each of these pieces of the app to emphasize:
  - simple APIs
  - statelessness
  - immutability
  - code readability

## Messages

The nodes transmit messages between each other in a more-or-less request-response style. This message-passing 
"session" may be described by a Finite State Machine, which I will attempt to define. This session is somewhat
analogous to an application specific HTTP session. The NANO protocol is on the same level on the OSI stack as HTTP,
being on top of TCP/UDP.

### Handshake

When a client finds a peer's IP address, it can start a Nano level connection with the handshake message. It starts this by sending a "query" which consists of a random 256 bit blob challenge which will also be assigned as the cookie for the remote node if it passes the signing challenge. The server receives this challenge blob, signs it with its private key, and sends it in the "response" portion of the handshake, while attaching a query/cookie/challenge of its own. The client verifies the signature of its cookie and if valid, adds it to its cookie store and continues further requests. The client should then also respond with the signed cookie to complete the handshake. 

### Bulk Pull

The bulk pull request consists of requesting a starting block hash, and ending block hash, and an optional count to limit the number of blocks received in this pull session. An "expected" block is cached in memory to signify what block should be received by the server next. Then the socket is read for incoming bytes. The first byte is expected to be the type of the incoming block. Then depending on the block type, that number of more bytes is read from the stream to be deserialized to a block. The official node does not seem to gracefully handle unhandled block types; it just logs it and ignore it. There is some business logic that occurs after receiving a block:
- check if work is valid
- check if the block was expected; if so, point `expected` to the previous block, otherwise increment an `unexpected_block` count
- receive and listen for next block if there are < 16k unexpected blocks

The `bulk_pull_client` is made in `bootstrap_connections.cpp` in `bootstrap_connections::request_pull`.

One simple algorithm to get all blocks on the network is:
- starting with the genesis account, pull all blocks from it
- add all accounts from the blocks to a queue/set of accounts to pull from
- repeat until all blocks are received and the queue is empty (also keep track of accounts that were fully fetched)

Of course, there are a few things to keep in mind here:
- the state of the ledger will have changed by the time the sync is done. This probably requires some sort of lite refreshing of the ledger state until fully synced
- these are all unconfirmed. There will have to be another pass on all the blocks until we get everything confirmed from all the representatives.
- the api seems like it would only return the pending blocks, not all blocks

Probably need to start with a `frontier_req` on the genesis account.

### Bulk Pull Account


## Quorum

A major element of NANO's consensus protocol is to achieve a quorum on blocks, which means that
enough staked votes agree to the view of a block such that the block becomes confirmed/cemented. 
The specifics here are still a bit fuzzy to me,
but I will update the docs here as I learn and understand how it is done in the current node.

One of my main fuzzy points is with this paragraph:
> Once a node sees enough PR vote responses to cross its local vote weight threshold for confirmation (>50% of online vote weight by default), it considers the transaction to be confirmed and then cements it as irreversible. Since the vast majority of transactions are not forks (no extra voting for fork resolution required), average Nano confirmation times are comparable to typical request-response internet latency.

Some questions:
- how does a node determine that >50% of vote weight is online? There must be a crawling of peers and their accounts which figures out the voting weights that are online. This also answers a fuzzy question about why transactions can't really be cemented until most blocks themselves are fetched by the node: those blocks rely on voting of very recent representives being online because if only old blocks are downloaded containing old delegated reps, they are likely not online any longer. This raises another tech question of how the nodes know whether they've downloaded most of the blocks? Maybe they don't need to know this. There could be an ongoing check as blocks are downloaded as to what percentage of the voting weight is online, and when the 50% threshold is reached, we can start querying for votes. These algorithms are non-trivial and must be implemented with care. Unfortunately, I am not really finding any mention of these algorithms in the docs, so I will need to reimplement similar behavior by reading the code of the current c++ node.

References:
- https://docs.nano.org/protocol-design/orv-consensus/
- https://docs.nano.org/whitepaper/english/#system-overview
