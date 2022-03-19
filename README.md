# Dialect

React components to use Dialect's web3 notifications and wallet-to-wallet chat.

Want to learn how to add Dialect to your dapp? See the Usage section below.

## Installation

**npm:**

```shell
npm install @dialectlabs/react @dialectlabs/react-ui --save
```

**yarn:**

```shell
yarn add @dialectlabs/react @dialectlabs/react-ui
```

## Usage

Dialect's react components library is best learned by example. This section describes how to use Dialect in your app by showing you how it has been embedded in various example apps in the `examples/` folder of this repository. Follow along in this section, & refer to the code in those examples.

1. `examples/chat/` -- A wallet-to-wallet chat example.
2. `examples/notifications/` -- A dapp notifications example. Note that to receive dapp messages to this UI component, you'll need to also run a monitoring service from Dialect's examples. That example can be found in `@dialectlabs/monitor.git`.

If you're interested in developing on Dialect while making live changes to the library, see the Development section below.

### Embed a notifications modal in your navbar

```typescript
import { NotificationsButton } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// ...
const wallet = useWallet();
const theme: 'dark' | 'light' = 'dark';
const YOUR_PROJECT_PUBLIC_KEY = new PublicKey('8cqm...quvHK');

return (
  <NotificationsButton
    wallet={wallet}
    publicKey={YOUR_PROJECT_PUBLIC_KEY}
    network={'devnet'}
    theme={theme}
    notifications={[
      { name: 'Welcome message on thread creation', detail: 'Event' },
      { name: 'Collateral health', detail: 'Below 130%' },
    ]}
  />
);

// ...
```

The component above is a self-contained button that opens a notifications modal in your react app. Let's look at what the props above do.

1. `wallet` – your user's wallet, used by Dialect to identify relevant messages and sign transactions.
2. `publicKey` – The public key associated with your project's messaging keypair. All notifications sent to your users are signed and written on-chain using this keypair.
3. `network` – Which network to target. `localnet`, `devnet`, & `mainnet-beta` are supported.

### Embed wallet-to-wallet chat in your navbar

```typescript
import { ChatButton } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

// ...
const wallet = useWallet();
const theme: 'dark' | 'light' = 'dark';

return <ChatButton wallet={wallet} network={'devnet'} theme={theme} />;

// ...
```

### Embed specific Dialect React components throughout your dapp

In addition to out-of-the-box button and modal support, you can also import subcomponents of Dialect's component library – messages lists, settings & configurations, etc. – directly into your project.

Note: This is not yet supported, but will be simple to. We're working on it.

### Apply custom styles to Dialect React components

In addition to its default light & dark modes, Dialect supports highly customizable styles, applicable to both notifications and chat.

Note: This styles API is incomplete and may be subject to change. If you have questions or suggestions, reach out to us at https://twitter.com/saydialect.

### Use custom React components

Dialect does not yet support custom react components, but has plans to support this in the future. Reach out to us at https://twitter.com/saydialect if you'd like support for this.

### Use the Dialect react hooks API

If you'd like greater control over your users' messaging experience, Dialect's React library also comes with a simple hooks API for interacting with Dialect's data & local state directly.

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

1. Ensure no packages have been built to the `lib/` folder:

```shell
rm -rf lib
```

2. Enable module transpilation in whichever `examples/` app you're building in. For example, if you're working from `examples/chat/`, uncomment both react packages in the next-transpile-modules section of `examples/chat/next.config.js`.

```javascript
// Uncomment these if you haven't built @dialectlabs/react and @dialectlabs/react-ui packages
// and targeting the sources
'@dialectlabs/react-ui',
'@dialectlabs/react',
```

3. Dialect uses tailwind for styling. Uncomment the following lines from `examples/chat/tailwind.config.js` to ensure tailwind styles are correctly applied live:

```javascript
// For local development uncomment next two lines for tailwind to take into account workspace files too
'../../node_modules/@dialectlabs/react-ui/**/*.{js,ts,jsx,tsx}',
'../../packages/dialect-react-ui-jet/**/*.{js,ts,jsx,tsx}',
```

4. And lastly, comment out the styles import in `examples/chat/pages/_app.tsx`, which is only used when importing compiled versions of Dialect's react packages:

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

```bash
pushd packages/dialect-react/
yarn build
npm publish --access public
popd

pushd packages/dialect-react-ui/
yarn build
yarn build:styles
npm publish --access public
popd
```

## Know-hows

- Currently every npm project inside the `packages` and `examples` directories, becomes part of the workspaces. Referencing other workspace package can be done by using npm project's name (in `package.json`)
  - Root `package.json` MAY contain references to child npm projects to simplify ci commands: e.g. in root `package.json` - `yarn build:react-ui` which would call the `packages/dialect-react-ui`'s `build` command.
- Linting configuration in located in repo's root and takes over the code style for all projects.
