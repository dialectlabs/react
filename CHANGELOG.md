# CHANGELOG

## [UNRELEASED]

- Add documentation to `README` on how to set up a hot-reloading local development environment.

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