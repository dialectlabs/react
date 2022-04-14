# CHANGELOG

## [UNRELEASED]

## [0.1.0] - 2022-02-12

- First version for open source. Includes pre-built notification center components in react-ui package, and first
  version of DialectProvider context in react package.

## [0.2.0] - 2022-03-25

- Started to keep changelog up to date... again...
- Added esm build to final bundle (resolves [#42](https://github.com/dialectlabs/react/issues/42))
  - Changed direct styles import from `@dialectlabs/react-ui/lib/index.css` to `@dialectlabs/react-ui/index.css`

## [0.2.1] - 2022-03-29

- Isolate dialect styles via 'dt-' prefix in tailwind

## [0.2.2] - 2022-03-29

- Add focus-visible polifill to avoid focus state on buttons on mouse click

## [0.2.3] - 2022-03-30

- Fix: handle for clicks outside modal

## [0.2.4] - 2022-03-30

- Introduces new component `Inbox` which represents a full page chat with a split view

## [0.2.5] - 2022-03-30

- Fixes modal styling prop in `Chat` component

## [0.2.6] - 2022-03-30

- Polishing `Chat` component (styling & UX)

## [0.2.7] - 2022-03-30

- Fix `Inbox` props

## [0.3.0] - 2022-03-31

- Add email notifications support
  - Added prop `channels` to `NotificationsButton` component
  - Added Email Notifications section in settings
- Major changes to Notifications flow and UI

## [0.3.1] - 2022-04-01

- fix `Inbox` resizing
- add sidebar scrolling in `Inbox` mode
- styling tweaks

## [0.3.2] - 2022-04-01

- fix missing dt prefix in color

## [0.3.3] - 2022-04-07

- fix mobile behavior + fix not preflighed text

## [0.3.4] - 2022-04-07

- fix settings button on notifications modal

## [0.4.0] - 2022-04-08

- Disabled send message text area and show loader instead of send button when message is sending or waiting approval
- Show send error message below the text input box in chat
- Remove flicker on message send
- Add encrypted threads support with Sollet wallet

## [0.4.1] - 2022-04-09

- Fix invalid thread recipient display name

## [0.5.0] - 2022-04-13

- Fix border-style issue in preflight styles
- new esm/cjs build configuration

## [0.5.1] - 2022-04-14

- fix: provide the current network to solscan links
- fix: elegant scrollbars on Windows and Linux

## [0.5.2] - 2022-04-14

- fix: border-style issue
