# CHANGELOG

## [UNRELEASED]

- Add documentation to `README` on how to set up a hot-reloading local development environment.

## [0.1.0] - 2022-02-12

- First version for open source. Includes pre-built notification center components in react-ui package, and first version of DialectProvider context in react package.

## [0.2.0] - 2022-03-25

- Started to keep changelog up to date... again...
- Added esm build to final bundle (resolves [#42](https://github.com/dialectlabs/react/issues/42))
  - Changed direct styles import from `@dialectlabs/react-ui/lib/index.css` to `@dialectlabs/react-ui/index.css`

## [0.2.1] - 2022-03-29

- Isolate dialect styles via 'dt-' prefix in tailwind

## [0.2.2] - 2022-03-29

- Add focus-visible polifill to avoid focus state on buttons on mouse click
