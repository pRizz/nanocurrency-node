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


