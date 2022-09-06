# CHANGELOG

## [UNRELEASED]

## [1.0.0-beta.55] - 2022-09-06

- feature: introduce `<SubscribeButton />` component in `react-ui`

## [1.0.0-beta.54] - 2022-09-01

- rollback to 1.0.0-beta.52

## [1.0.0-beta.53] - 2022-09-01

- failed release

## [1.0.0-beta.52] - 2022-09-01

- feature: add unread messages indicator for chat components
- chore: fix typo in theme variable name for adornmentButton (BREAKING)

## [1.0.0-beta.51] - 2022-08-30

- feature: support dapp-configured telegram bots

## [1.0.0-beta.50] - 2022-08-26

- fix: polling for chat components

## [1.0.0-beta.49] - 2022-08-25

- feature: expose package version
- feature: versions are now visible for chat and notification components

## [1.0.0-beta.48] - 2022-08-24

- feature: mark thread's messages as read upon entry
- feature: add pluggable identity providers

## [1.0.0-beta.47] - 2022-08-20

- refactor: export UI primitives

## [1.0.0-beta.46] - 2022-08-17

- feature: update `useDappAudience` to take into account address types
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.45] - 2022-08-14

- chore: move cardinal, SNS, & dapp identities to react-sdk

## [1.0.0-beta.43] - 2022-08-11

- hotfix: notifications settings go back button
- fix: refresh interval in notifications

## [1.0.0-beta.42] - 2022-08-11

- chore: upd notification default styles

## [1.0.0-beta.41] - 2022-08-11

- hotfix: notifications header router

## [1.0.0-beta.40] - 2022-08-11

- fix: header back button(realms use case)

## [1.0.0-beta.39] - 2022-08-11

- fix: update header, add missing states and align styling with chat
- chore: export settings components

## [1.0.0-beta.38] - 2022-08-09

- fix: calculating audience for dapps without notifications types
- fix: error handling on sending broadcast
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.37] - 2022-08-09

- fix: broadcast audience calculation

## [1.0.0-beta.36] - 2022-08-09

- fix: consistent `useDappAudience` return type

## [1.0.0-beta.35] - 2022-08-09

- fix: notifications header

## [1.0.0-beta.34] - 2022-08-09

- fix: tune a bit wallet settings field
- chore: add useDappAudience hook for dapp dashboard

## [1.0.0-beta.33] - 2022-08-09

- fix: wallet create button

## [1.0.0-beta.32] - 2022-08-09

- fix: notif channel togglers and refactoring
- fix: do not filter subscriptions for general broadcast
- fix: toggle styles with using some css reset or tailwind forms

## [1.0.0-beta.30] - 2022-08-08

- fix: export safe version of broadcast form with already filled dapp prop

## [1.0.0-beta.29] - 2022-08-08

- refactor: separate wrappers for wallet, connection, encryption states, export them from `react-ui`
- chore: export unwrapped component `<BroadcastForm/>` as well to be able to compose custom dashboards

## [1.0.0-beta.28] - 2022-08-04

- feature: add headless mode for `<Broadcast />`

## [1.0.0-beta.27] - 2022-08-03

- feature: add dapp name and avatar in chat

## [1.0.0-beta.26] - 2022-08-02

- fix: wallet address on settings screen

## [1.0.0-beta.25] - 2022-08-02

- feature: add unread notifictions indicator

## [1.0.0-beta.24] - 2022-07-31

- fix: reduce trash can size

## [1.0.0-beta.23] - 2022-07-30

- feature: implement new notifications settings UI

## [1.0.0-beta.22] - 2022-07-26

- feature: configurable notifications in `<NotificationsButton/>` component settings
- feature: configurable notifications in `<BroadcastForm/>` component
- fix: types for react 18

## [1.0.0-beta.21] - 2022-07-25

- chore: minor stylistic changes
- fix: add missing notifs header
- chore: better web3 notifications enable/disable button naming

## [1.0.0-beta.20] - 2022-07-21

- feature: add use hardware wallet option

## [1.0.0-beta.19] - 2022-07-16

- fix: default navigation to thread if web3 channel enabled

## [1.0.0-beta.18] - 2022-07-16

- feature: show value of address itself for submitted
- fix: show submitted state for submitted addresses
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.17] - 2022-07-16

- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.16] - 2022-07-16

- fix: handle error on toggle notification channels, so it doesn't break the app
- refactor: make `<NotificationsButton/>` to use new `useAddresses` hook
- feature: introduce `gatedView` prop to `<NotificationsButton/>`
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.15] - 2022-07-12

- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.14] - 2022-07-12

- fix: sync state in case thread doesnt exists but address is saved in db
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.13] - 2022-07-08

- fix: default notification channels - web3, email, telegram, sms, if channels props not provided to component
- feature: summary counts of addresses in broadcast tool

## [1.0.0-beta.12] - 2022-07-08

- fix: show dev bot url for `development` or `local-development` envs
- fix: add text limit for Broadcast title 'cause it now included in message
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.11] - 2022-07-07

- feature: add `<Broadcast/>` component
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.10] - 2022-06-30

- chore: use exact @cardinal/namespaces@3.1.0 to avoid errors
- fix: throw errors from helper functions fetchTwitterHandleFromAddress, fetchImageUrlFromTwitterHandle to reset isLoading prop

## [1.0.0-beta.9] - 2022-06-30

- chore: revert bump @cardinal/namespaces

## [1.0.0-beta.7] - 2022-06-30

- fix: always render default header to avoid empty header in bottom-chat mode
- chore: bump @cardinal/namespaces

## [1.0.0-beta.6] - 2022-06-30

- BREAKING CHANGE: feature: allow customize to style on-chain message bubbles (purple messages)
- feature: new chat header
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.5] - 2022-06-26

- fix: MessagePreview truncate, make wider, minor ui/ux improvements
- feature: encryption keys awaiting screen
- chore: bump @dialeclabs/react-sdk

## [1.0.0-beta.4] - 2022-06-25

- fix outdated builded lib folder

## [1.0.0-beta.3] - 2022-06-25

- fix: SNS domain as priority, case insensitive lookup

## [1.0.0-beta.2] - 2022-06-24

- fix: shrinking MessagePreview in ThreadsList
- fix: hide settings button for off-chain threads if you are not an admin

## [1.0.0-beta.1] - 2022-06-24

- new implementation using react-sdk

## [0.9.2] - 2022-06-21

- fix: show solana name service domain without middle truncating
- fix: redirect after withdraw to threads list
- fix: bottom chat covering makes part of the page un-clickable when closed

## [0.9.1] - 2022-06-15

- fix: type error with initial address state of create thread page
- fix: bottom chat positioning

## [0.9.0] - 2022-06-14

- feat: add bottom chat component and example
- feat: [BREAKING] add ui management provider to control dialect related UIs
- styles: adjust header styles for Chat and implement as a reusable component

## [0.8.11] - 2022-06-14

- fix: animation of sending and appearing message

## [0.8.10] - 2022-06-14

- added logic to notification ui to display new notification badge
- fix: open thread if user entered address with whom thread already exists
- fix: do not fetch handles and avatars twice
- feat: a bunch of UX improvements such as Optimistic UI
- fix: solana name service support
- feat: add bottom chat component and example
- feat: [BREAKING] add ui management provider to control dialect related UIs
- styles: adjust header styles for Chat and implement as a reusable component

## [0.8.9] - 2022-06-07

- fix: add missing cardinal dependency

## [0.8.8] - 2022-06-01

- Fix published version build

## [0.8.7] - 2022-06-01

- Add solana name service support
- Add polling props to notfication button

## [0.8.6] - 2022-05-11

- Bump `@dialectlabs/react` package version
- Fix: label margin

## [0.8.5] - 2022-05-11

- chore: remove unnecessary console.logs

## [0.8.4] - 2022-05-09

- better use-solana compatability
- mark library as side effect free

## [0.8.3] - 2022-05-08

- Fix render loop caused by default theme variable

## [0.8.1] - 2022-05-04

- Bump `@dialectlabs/react` package version

## [0.8.0] - 2022-05-04

- feat: bring telegram, sms, email and wallet as toggle sections
- refactor: web2 error handling, show exact error messages
- feat: Expose the notification modal
- feat: Add optional back button for the modal

## [0.7.3] - 2022-04-29

- feat: revert powered by footer

## [0.7.2] - 2022-04-28

- chore: remove wallet identity provider from notifications button

## [0.7.1] - 2022-04-28

- chore: bump @dialectlabs/web3

## [0.7.0] - 2022-04-27

- feat: add ability to configure animation props
- fix: theme's defaultVariables are no longer mutable
- chore: bump @dialectlabs/web3

## [0.6.11] - 2022-04-26

- feat: added UI in notification for email verification
- feat: added UI in notification for sms verification
- Add client-side address or twitter handle validation.
- Allow thread creation using twitter handle.
- Only show delete thread button to dialect admins.
- chore: reintroduce wildcard exports

## [0.6.10] - 2022-04-23

- Bump `@dialectlabs/react` package version

## [0.6.9] - 2022-04-22

- chore: remove wildcard exports
- feat: remove Powered By footer

## [0.6.8] - 2022-04-22

- Bump `@dialectlabs/react` package version

## [0.6.7] - 2022-04-22

- hotfix: remove memory leak while wallet is disconnected

## [0.6.6] - 2022-04-21

- fix: if there is a chat with entered wallet redirect to this chat; add error parsing for chat already exists
- fix: prevent long message from expanding entire chat
- Bump `@dialectlabs/react` package version

## [0.6.5] - 2022-04-21

- Bump `@dialectlabs/react` package version

## [0.6.4] - 2022-04-20

- Bump `@dialectlabs/react` package version

## [0.6.3] - 2022-04-20

- Bump `@dialectlabs/react` package version

## [0.6.2] - 2022-04-20

- Fixed styles for button loading state, borders, transforms
- Fixed styles for chat title (white text for light scheme)
- Reset dialect address when wallet changed
- Bump `@dialectlabs/react` package version

## [0.6.1] - 2022-04-18

- Fix: normalize avatars' styles

## [0.6.0] - 2022-04-15

- Add ability to show twitter handle/avatar of verified wallet addresses using Cardinal

## [0.5.2] - 2022-04-14

- fix: border-style issue

## [0.5.1] - 2022-04-14

- fix: provide the current network to solscan links
- fix: elegant scrollbars on Windows and Linux

## [0.5.0] - 2022-04-13

- Fix border-style issue in preflight styles
- new esm/cjs build configuration

## [0.4.1] - 2022-04-09

- Fix invalid thread recipient display name

## [0.4.0] - 2022-04-08

- Disabled send message text area and show loader instead of send button when message is sending or waiting approval
- Show send error message below the text input box in chat
- Remove flicker on message send
- Add encrypted threads support with Sollet wallet

## [0.3.4] - 2022-04-07

- fix settings button on notifications modal

## [0.3.3] - 2022-04-07

- fix mobile behavior + fix not preflighed text

## [0.3.2] - 2022-04-01

- fix missing dt prefix in color

## [0.3.1] - 2022-04-01

- fix `Inbox` resizing
- add sidebar scrolling in `Inbox` mode
- styling tweaks

## [0.3.0] - 2022-03-31

- Add email notifications support
  - Added prop `channels` to `NotificationsButton` component
  - Added Email Notifications section in settings
- Major changes to Notifications flow and UI

## [0.2.7] - 2022-03-30

- Fix `Inbox` props

## [0.2.6] - 2022-03-30

- Polishing `Chat` component (styling & UX)

## [0.2.5] - 2022-03-30

- Fixes modal styling prop in `Chat` component

## [0.2.4] - 2022-03-30

- Introduces new component `Inbox` which represents a full page chat with a split view

## [0.2.3] - 2022-03-30

- Fix: handle for clicks outside modal

## [0.2.2] - 2022-03-29

- Add focus-visible polifill to avoid focus state on buttons on mouse click

## [0.2.1] - 2022-03-29

- Isolate dialect styles via 'dt-' prefix in tailwind

## [0.2.0] - 2022-03-25

- Started to keep changelog up to date... again...
- Added esm build to final bundle (resolves [#42](https://github.com/dialectlabs/react/issues/42))
  - Changed direct styles import from `@dialectlabs/react-ui/lib/index.css` to `@dialectlabs/react-ui/index.css`

## [0.1.0] - 2022-02-12

- First version for open source. Includes pre-built notification center components in react-ui package, and first
  version of DialectProvider context in react package.
