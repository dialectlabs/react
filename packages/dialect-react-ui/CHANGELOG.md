# CHANGELOG

## [UNRELEASED]

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
