# CHANGELOG

## [UNRELEASED]

- chore: bump @dialectlabs/web3

## [0.4.9] - 2022-04-26

- feat: added API for code verification + resend code 
– fix: import Message type from '@dialectlabs/web3'
- chore: reintroduce wildcard exports
- fix: error types
- fix: safe way to get wallet type

## [0.4.8] - 2022-04-23

- fix: downgrade solana to 1.38.0 re: https://github.com/solana-labs/solana/issues/24462.

## [0.4.7] - 2022-04-22

- chore: remove wildcard exports

## [0.4.6] - 2022-04-22

- hotfix: remove memory leak while wallet is disconnected

## [0.4.5] - 2022-04-22

- fix: recovering after disconnected from the Solana blockchain error

## [0.4.4] - 2022-04-20

- fix: added hash value for array, arrays comparing by hash not by message length
- fix: make messages keys more unique

## [0.4.3] - 2022-04-20

- hotfix: Sollet wallet detection with @saberhq/use-solana package in production

## [0.4.2] - 2022-04-20

- fix: Sollet wallet detection with @saberhq/use-solana package in production

## [0.4.1] - 2022-04-20

- fix: import Message type from '@dialectlabs/web3'
- fix: Sollet wallet detection with @saberhq/use-solana package

## [0.4.0] - 2022-04-13

- New esm/cjs build configuration

## [0.3.0] - 2022-04-08

- Add encrypted threads support with Sollet wallet

## [0.2.0] - 2022-03-31

- Add email notifications support
