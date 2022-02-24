# Dialect

React components to use Dialect's web3 notifications.

## Installation

**npm:**

```shell
npm install @dialectlabs/react @dialectlabs/react-ui --save
```

**yarn:**

```shell
yarn add @dialectlabs/react @dialectlabs/react-ui
```

## Development

### Prerequisites

- Git
- Yarn (<2)
- Nodejs (>=15.10 <17)

### Get Started

This repo utilizes [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Publishable packages are located under `packages` directory. `examples` directory contains projects to demonstrate how can Dialect be used.

The simplest way to develop on dialect's component library and headless react contexts locally is to run one of the demo apps in the `examples/` directory, and ensure you are targeting the local instances of `packages/dialect-react/` & `packages/dialect-react-ui/`.

Once set up, you'll have live, hot-reloading on changes. Some manual configuration is required to enable this.

#### Enable hot-reloading from an `examples/` app

Choose one of the `examples/` apps you'd like to do development from and then make the following changes in its source. For illustration purposes we choose `examples/basic/`.

1. Ensure no packages have been built to the `lib/` folder:

```shell
rm -rf lib
```

2. Enable module transpilation in whichever `examples/` app you're building in. For example, if you're working from `examples/basic/`, uncomment both react packages in the next-transpile-modules section of `examples/basic/next.config.js`.

```javascript
// Uncomment these if you haven't built @dialectlabs/react and @dialectlabs/react-ui packages
// and targeting the sources
'@dialectlabs/react-ui',
'@dialectlabs/react',
```

3. Dialect uses tailwind for styling. Uncomment the following lines from `examples/basic/tailwind.config.js` to ensure tailwind styles are correctly applied live:

```javascript
// For local development uncomment next two lines for tailwind to take into account workspace files too
'../../node_modules/@dialectlabs/react-ui/**/*.{js,ts,jsx,tsx}',
'../../packages/dialect-react-ui-jet/**/*.{js,ts,jsx,tsx}',
```

4. And lastly, comment out the styles import in `examples/basic/pages/_app.tsx`, which is only used when importing compiled versions of dialect's react packages:

```typescript
// import '@dialectlabs/react-ui/lib/index.css';
```

All of the above changes require restarting the next server, if you've already started it.

You can now run the example by following the instructions in the next section.

#### Start the examples

To get started, launch example's next dev server:

```shell
yarn # in root dir
cd examples/chat
yarn dev
```

Now you have a hot reload of the packages in the workspace.

### Etc.

#### Convert svg icons to React Components (via `svgr`)

We use `svgr` to manage a minimal set of svg icons for Dialect's `dialect-react-ui` component library.

Store original svgs in `Icon/source/`, then run inside `Icon` directory to convert:

```
  npx @svgr/cli --typescript --out-dir . -- source
```

Import Icon as a React Component from `Icon`, e.g. (`import {BackArrow} from '/Icon/'`). See [SVGR Command Line guide](https://react-svgr.com/docs/cli/) for more details.

## Publishing

To add.

## Know-hows

- Currently every npm project inside the `packages` and `examples` directories, becomes part of the workspaces. Referencing other workspace package can be done by using npm project's name (in `package.json`)
  - Root `package.json` MAY contain references to child npm projects to simplify ci commands: e.g. in root `package.json` - `yarn build:react-ui` which would call the `packages/dialect-react-ui`'s `build` command.
- Linting configuration in located in repo's root and takes over the code style for all projects.
