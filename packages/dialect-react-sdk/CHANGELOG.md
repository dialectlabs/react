# CHANGELOG

## [UNRELEASED]

## [1.0.0-beta.20] - 2022-08-09

- chore: refactoring, introduced two new hooks `useNotificationChannel` and `useNotificationChannelDappSubscription` instead of `useAddresses`

## [1.0.0-beta.19] - 2022-08-04

- fix: calculate `isFetching` in `useDappNotificationSubscriptions` in the same way it's done in other hooks

## [1.0.0-beta.18] - 2022-08-03

- feature: add dapp name and avatar in chat

## [1.0.0-beta.17] - 2022-08-02

- feature: add unread notifictions indicator

## [1.0.0-beta.16] - 2022-07-26

- feature: introduce `useNotificationSubscriptions` hook to configure notifications
- feature: introduce `useDappNotificationSubscriptions` hook to fetch notification subscriptions on behalf of dapp
- fix: types for react 18

## [1.0.0-beta.15] - 2022-07-25

- fix: notification togglers
- fix: auth request cancel do not mark state as connected

## [1.0.0-beta.14] - 2022-07-21

- feature: add use hardware wallet option

## [1.0.0-beta.13] - 2022-07-16

- fix: switch statuses if error happens for CRUD in `useAddresses`

## [1.0.0-beta.12] - 2022-07-16

- fix: fetch only dAddresses related to this particular dapp

## [1.0.0-beta.10] - 2022-07-16

- refactor: introduce to use new addresses API via SDK

## [1.0.0-beta.9] - 2022-07-12

- chore: bump @dialectlabs/sdk

## [1.0.0-beta.8] - 2022-07-12

- fix: sync state in case thread doesnt exists but address is saved in db

## [1.0.0-beta.7] - 2022-07-08

- hotfix: save dialect auth token per wallet when using v0 addresses api

## [1.0.0-beta.6] - 2022-07-07

- feature: add `useDapp` and `useDappAddresses` hooks to the `react-sdk`

## [1.0.0-beta.5] - 2022-06-30

- chore: bump @dialectlabs/sdk

## [1.0.0-beta.4] - 2022-06-27

- fix: update threads order after new message is sent
- chore: bump @dialectlabs/sdk

## [1.0.0-beta.3] - 2022-06-25

- chore: bump @dialectlabs/sdk

## [1.0.0-beta.2] - 2022-06-24

- initial release with new react api implementation using sdk
