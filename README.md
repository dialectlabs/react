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

1. `examples/bottom-chat/` -- A wallet-to-wallet chat box anchored to bottom.
2. `examples/inbox/` -- A full page wallet-to-wallet chat.
3. `examples/notifications/` -- A dapp notifications example. Note that to receive dapp messages to this UI component, you'll need to also run a monitoring service from Dialect's examples. That example can be found in [`@dialectlabs/monitor`](https://github.com/dialectlabs/monitor).

If you're interested in developing on Dialect while making live changes to the library, see the Development section below.

### Embed a notifications modal in your navbar

```typescript jsx
import '@dialectlabs/react-ui/index.css';

import { NotificationsButton, DialectUiManagementProvider } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// ...
const wallet = useWallet();
const theme: 'dark' | 'light' = 'dark';
const YOUR_PROJECT_PUBLIC_KEY = new PublicKey('8cqm...quvHK');

return (
  <DialectUiManagementProvider>
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
  </DialectUiManagementProvider>
);

// ...
```

The component above is a self-contained button that opens a notifications modal in your react app. Let's look at what the props above do.

1. `wallet` – your user's wallet, used by Dialect to identify relevant messages and sign transactions.
2. `publicKey` – The public key associated with your project's messaging keypair. All notifications sent to your users are signed and written on-chain using this keypair.
3. `network` – Which network to target. `localnet`, `devnet`, & `mainnet-beta` are supported.

### Embed a full inbox view in your website

```typescript jsx
import '@dialectlabs/react-ui/index.css';

// You can also use the `DialectThemeProvider` instead
import { Inbox, ThemeProvider, DialectUiManagementProvider } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

// ...
const wallet = useWallet();
const theme: 'dark' | 'light' = 'dark';

return (
  <ThemeProvider theme={theme}>
    <DialectUiManagementProvider>
      <Inbox
        wallet={wallet}
        dialectId="dialect-inbox"
        wrapperClassName="p-2 h-full overflow-hidden rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600"
      />
    </DialectUiManagementProvider>
  </ThemeProvider>
);

// ...
```

The component above contains a wallet's current inbox of current chats/notifications. From this inbox a user can create chats, browse chats, and send messages. Props are outlined as follows.

1. `wallet` – your user's wallet, used by Dialect to identify relevant messages and sign transactions.
2. `dialectId` — a custom id for each dialect component, e.g. 'dialect-inbox' or 'marketplace-bottom-chat'
3. `wrapperClassName` – _optional_ - a string representation of the class attribute on the inbox's _container_ view, both augments and overrides Dialect styling.
4. `contentWrapperClassName` – _optional_ - a string representation of the class attribute on the inbox's _content_ view, augments Dialect styling.

### Embed wallet-to-wallet chat in your navbar

```typescript jsx
import '@dialectlabs/react-ui/index.css';

import { ChatButton, DialectUiManagementProvider } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

// ...
const wallet = useWallet();
const theme: 'dark' | 'light' = 'dark';

return (
  <DialectUiManagementProvider>
    <ChatButton
      wallet={wallet}
      dialectId="header-chat-button"
      network={'devnet'}
      theme={theme}
    />
  </DialectUiManagementProvider>
);

// ...
```

### DialectUiManagementProvider

DialectUiManagementProvider is the provider to control all Dialect related UIs in your dApp. Import `useDialectUiId` hook to gain access to a certain window, and be able to open popup, close popup or navigate through different pages (only for Chat) externally. 

Please see `examples/bottom-chat` for more clarity and usage examples. 

### Embed specific Dialect React components throughout your dApp

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

## Publishing

1.

```shell
yarn build:all
pushd packages/dialect-react/
npm publish --access public
popd
pushd packages/dialect-react-ui/
npm publish --access public
popd
```

2. Update all versions of packages to the new one(e.g. bump react, react-ui version in examples, starters folder)

## Know-hows

- Currently every npm project inside the `packages` and `examples` directories, becomes part of the workspaces. Referencing other workspace package can be done by using npm project's name (in `package.json`)
  - Root `package.json` MAY contain references to child npm projects to simplify ci commands: e.g. in root `package.json` - `yarn build:react-ui` which would call the `packages/dialect-react-ui`'s `build` command.
- Linting configuration in located in repo's root and takes over the code style for all projects.
