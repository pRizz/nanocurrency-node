# Release Plan

This document outlines a general release plan highlighting the major requirements
for certain releases to be created.

## Pre Alpha Features
-[x] handshake with other nodes
-[] keepalive
-[] crawl the network for finding peers
-[] save/assign cookies of other nodes
-[] fetch blocks from the network
-[] save blocks to db
-[] confirm/cement blocks on network

## Alpha
The alpha version of the app will be a useful test for being
able to sync the ledger.
-[] ability to download and confirm all blocks on the network
-[] telemetry to determine performance
-[] decent logging
-[] peer db
-[] daemon configurability using pm2
-[] new app name to differentiate from Nano Foundation

## Beta
-[] ability to vote as a rep or principal rep
-[] performance testing as a rep

## Production
-[] app is sufficiently deployed and tested in the wild with no major issues
-[] basic RPC commands like the official node

## V2
-[] wallet layer
  -[] create wallet, send Nano, pocket Nano, etc
  -[] publish send blocks

# V3
-[] front end wallet layer
-[] light wallets
