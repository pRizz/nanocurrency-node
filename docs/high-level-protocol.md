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
