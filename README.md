# [Dialect](https://www.dialect.to/) React SDK & UI 💬 

![react-sdk](https://img.shields.io/npm/v/@dialectlabs/react-sdk?color=success&label=react-sdk) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-ui?color=success&label=react-ui) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-sdk-blockchain-solana?color=success&label=react-sdk-blockchain-solana) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-sdk-blockchain-aptos?color=success&label=react-sdk-blockchain-aptos)

React components to use Dialect's wallet notifications and wallet-to-wallet chat.

Want to learn how to add Dialect to your dapp? See our [Docs](https://docs.dialect.to/).

### Table of Contents

- [Installation](#Installation)
- [FAQ](#FAQ)
- [Development](#Development)

## Installation

**npm:**

```shell
npm install @dialectlabs/react-ui --save

# Solana messaging
npm install @dialectlabs/react-sdk-blockchain-solana --save

# Aptos messaging
npm install @dialectlabs/react-sdk-blockchain-aptos --save
```

**yarn:**

```shell
yarn add @dialectlabs/react-ui

# Solana messaging
yarn add @dialectlabs/react-sdk-blockchain-solana

# Aptos messaging
yarn add @dialectlabs/react-sdk-blockchain-aptos
```

## FAQ

### I don't need the whole functionality of these pre-built components. Can I reuse only specific parts of them, e.g. thread view?

At this stage, it is not yet supported, but will be simple to. We're working on it. Composition and flexibility is everything!

### How to apply custom styles to Dialect React components?

In addition to its default light & dark modes, Dialect supports highly customizable styles, applicable to both notifications and chat.

Note: This styles API is incomplete and may be subject to change. If you have questions or suggestions, reach out to us at https://twitter.com/saydialect.

### I want to change the structure of <view_name> in <component_name>. How can I do that? 

Existing components are designed to be uncontrolled and very coupled with `react-sdk-blockchain-*` and `react-sdk` logic. Dialect does not yet support injecting custom views in current implementation, but has plans to add this in the future. Reach out to us at https://twitter.com/saydialect if you'd like support for this.

### Can I use only Dialect's logic for messaging and notifications experience?

If you'd like greater control over your users' messaging experience, Dialect's React library also comes with a simple hooks API from `@dialectlabs/react-sdk-blockchain-*` and `@dialectlabs/react-sdk` packages for interacting with Dialect's data & local state directly.

## Development

### Prerequisites

- Git
- Yarn (<2)
- Nodejs (>=15.10 <17)

### Get Started

This repo utilizes [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Publishable packages are located under `packages` directory. `examples` directory contains apps to demonstrate how can Dialect be used.

The simplest way to develop on Dialect's component library and headless react contexts locally is to run one of the demo apps in the `examples/` directory, and ensure you are targeting the local instances of `packages/dialect-react/` & `packages/dialect-react-ui/`. How to best do this is described below.

Once set up, you'll have live, hot-reloading on changes. Some manual configuration is required to enable this.

#### Enable hot-reloading from an `examples/` app

Choose one of the `examples/` apps you'd like to do development from and then make the following changes in its source. For illustration purposes we choose `examples/chat/`.

For example you want to make changes in `dialect-react` library

Run

```shell
yarn dev:react
```

All of the above changes require restarting the next server and clearing cache (just in case), if you've already started it.

You can now run the example by following the instructions in the next section.

#### Start the examples

To get started, launch example's next dev server:

```shell
yarn # in root dir
cd examples/chat
yarn dev
```

Now you have a hot reload of the packages in the workspace.

#### Developing another project with linked library

For example you want to make changes in `dialect-react` library and see changes in another project

1. Link `dialect-react` library

```shell
cd packages/dialect-react
yarn link
```

2. Link `react` and `react-dom` libraries. This is necessary since you shouldn't have two different react libraries in one project

```shell
cd node_modules/react
yarn link

cd node_modules/react-dom
yarn link
```

3. Go to your project and link libraries

```shell
cd my-project
yarn link @dialectlabs/react
yarn link react
yarn link react-dom
```

4. Run library bundler in dev mode

```shell
yarn dev:react
```

### Etc.

#### Convert svg icons to React Components (via `svgr`)

We use `svgr` to manage a minimal set of svg icons for Dialect's `dialect-react-ui` component library.

Store original svgs in `Icon/source/`, then run inside `Icon` directory to convert:

```shell
  cd packages/dialect-react-ui/components/Icon/
  npx @svgr/cli --typescript --out-dir .  --ignore-existing -- source
```

Import Icon as a React Component from `Icon`, e.g. (`import {BackArrow} from '/Icon/'`). See [SVGR Command Line guide](https://react-svgr.com/docs/cli/) for more details.

### Publishing

1.

```shell
yarn build:all
pushd packages/dialect-react-sdk/
npm publish --access public
popd
pushd packages/dialect-react-ui/
npm publish --access public
popd
```

2. Update all versions of packages to the new one(e.g. bump react, react-ui version in examples, starters folder)