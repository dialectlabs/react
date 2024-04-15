# [Dialect](https://www.dialect.to/) React SDK & UI 💬 

![react-sdk](https://img.shields.io/npm/v/@dialectlabs/react-sdk?color=success&label=react-sdk) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-ui?color=success&label=react-ui) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-sdk-blockchain-solana?color=success&label=react-sdk-blockchain-solana) 

React components to use Dialect's wallet alerts.

Want to learn how to add Dialect to your dapp? See our [Docs](https://docs.dialect.to/).

### Table of Contents

- [Installation](#Installation)
- [FAQ](#FAQ)
- [Development](#Development)

## Installation

**npm:**

```shell
npm install @dialectlabs/react-ui --save

npm install @dialectlabs/react-sdk-blockchain-solana --save
```

**yarn:**

```shell
yarn add @dialectlabs/react-ui

yarn add @dialectlabs/react-sdk-blockchain-solana
```

## Development

### Prerequisites

- Git
- NPM (>=10)
- Nodejs (>=18)

### Get Started

This repo utilizes [Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces). Publishable packages are located under `packages` directory. `examples` directory contains apps to demonstrate how can Dialect be used.

The simplest way to develop on Dialect's component library and headless react contexts locally is to run one of the demo apps in the `examples/` directory, and ensure you are targeting the local instances of `packages/react-sdk`, `packages/react-ui` and `packages/react-sdk-blockchain-solana`. How to best do this is described below.

Once set up, you'll have live, hot-reloading on changes. Some manual configuration is required to enable this.

#### Enable hot-reloading from an `examples/` app

Choose one of the `examples/` apps you'd like to do development from and then make the following changes in its source. For illustration purposes we choose `examples/notifications-solana`.

For example you want to make changes in `react-ui` library

Run

```shell
npm run dev:react-ui
```

All of the above changes require restarting the next server and clearing cache (just in case), if you've already started it.

You can now run the example by following the instructions in the next section.

#### Start the examples

To get started, launch example's next dev server:

```shell
npm install # in root dir
cd examples/notifications-solana
npm run dev
```

Now you have a hot reload of the packages in the workspace.

### Publishing

1. 

```shell
npm run build:all
pushd packages/react-sdk/
npm publish --access public
popd
pushd packages/react-sdk-blockchain-solana/
npm publish --access public
popd
pushd packages/react-ui/
npm publish --access public
popd
```

2. Update all versions of packages to the new one(e.g. bump react, react-ui version in examples, starters folder)