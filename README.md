# [Dialect](https://www.dialect.to/) React SDK & UI 💬 &middot; ![react-sdk](https://img.shields.io/npm/v/@dialectlabs/react-sdk?color=success&label=react-sdk) ![npm](https://img.shields.io/npm/v/@dialectlabs/react-ui?color=success&label=react-ui)

React components to use Dialect's wallet notifications and wallet-to-wallet chat.

Want to learn how to add Dialect to your dapp? See the [Usage](#Usage) section below and/or check out our [docs](https://docs.dialect.to/).


## Installation

**npm:**

```shell
npm install @dialectlabs/react-ui --save
# or if you plan to build UI yourself
npm install @dialectlabs/react-sdk --save
```

**yarn:**

```shell
yarn add @dialectlabs/react-ui
# or if you plan to build UI yourself
yarn add @dialectlabs/react-sdk
```

## Usage

Dialect's React components library is best learned by example. This section describes how to use Dialect in your app by showing you how it has been embedded in various example apps in the [`examples/`](https://github.com/dialectlabs/react/tree/master/examples) folder of this repository. Follow along in this section, & refer to the code in those examples.

If you're interested in contributing, see the Development section below (`CONTRIBUTION.md` is a TBD).

As you may have noticed, this repo covers two packages: `@dialectlabs/react-sdk` and `@dialectlabs/react-ui`.

`@dialectlabs/react-sdk` contains React abstractions (context, hooks) over [`@dialectlabs/sdk`](https://github.com/dialectlabs/sdk). Has necessary tools to build a UI for messaging or notifications.

- Handles (re-)fetching and storing necessary messaging data from/on Solana blockchain, Dialect Cloud (for off-chain).
- Provides connection state to Solana blockchain and Dialect Cloud (for off-chain)
- Exposes low-level SDK API

`@dialectlabs/react-ui` contains pre-built, themeable, self-sufficient and _opinionated_ UI components for messaging and notification centers.

- All exposed components are themed and can be configured to fit different use-cases
- Even though exported UIs are controlled React components, the UI state can be handled anywhere in your dapp (e.g. routing) 

### Basic

If you are new to Dialect, it's highly recommended to start with pre-built components from `@dialectlabs/react-ui` package. In this case, basic integration falls to 3 steps:
1. Preliminary Setup
2. Configuration
3. Render

#### Preliminary Setup

Import styles, add necessary providers in your dapp, specifically: `DialectContextProvider`, `DialectThemeProvider` and `DialectUiManagementProvider`.

- `DialectContextProvider` - re-export from `@dialectlabs/react-sdk`. Handles connection info, threads and messages state.
- `DialectThemeProvider` - as name suggests, stores theme for Dialect UIs
- `DialectUiManagementProvider` - stores UI state (open/close state, current route) for Dialect UIs

```typescript jsx
/* App.tsx */

// Baseline styles for Dialect UIs
import '@dialectlabs/react-ui/index.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { DialectUiManagementProvider, DialectContextProvider, DialectThemeProvider } from '@dialectlabs/react-ui';
import type { FC } from 'react';

// Dialect needs the connected wallet information from your wallet adapter, wrapping in a separate component for composition
const DialectProviders: FC = ({ children }) => {
  return (
    // We are missing some props for now, we will add them in the next step
    <DialectContextProvider>
      <DialectThemeProvider>
        <DialectUiManagementProvider>
          {children}
        </DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectContextProvider>
  );
}

const App = () => {
  return (
    // In this example, using @solana/wallet-adapter-react package for wallet data.
    // Assuming WalletProvider and ConnectionProvider are properly configured with necessary wallets and network.
    <ConnectionProvider>
      <WalletProvider> 
        <DialectProviders>
          <MyAwesomeDapp />
        </DialectProviders>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

#### Configuration

Next we need to configure added providers: where to connect, which backends to use, theme. Configuration for certain provider may vary per use-case. In this case, we will configure our provider for a chat component, specifically `BottomChat`.

```typescript jsx
/* App.tsx */
/* ... imports from previous step ... */
import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { DialectWalletAdapter } from '@dialectlabs/react-ui';

const DialectProviders: FC = ({children}) => {
  const wallet = useWallet();
  // We need to create an adapter for Dialect to support any type of wallet
  // `convertWalletForDialect` is a function that needs to be implemented to convert `WalletContextState` to `DialectWalletAdapter` type.
  // Please navigate to any example in `examples` folder and find an example implementation there.
  const dialectWallet = useMemo(() => convertWalletForDialect(wallet), [wallet]);

  // Basic configuration for dialect. Target mainnet-beta and dialect cloud production environment 
  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud, Backend.Solana],
      environment: 'production',
    }),
    []
  );

  return (
    <DialectContextProvider config={dialectConfig} wallet={dialectWallet}>
      <DialectThemeProvider theme="dark">
        <DialectUiManagementProvider>
          {children}
        </DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectContextProvider>
  );
}
```

#### Render

Now that we've configured our providers, let's add `BottomChat` to our dapp.

```typescript jsx
/* MyAwesomeDapp.tsx */

const MyAwesomeDapp = () => {
  // `dialectId` is the identificator for this specific dialect-related component and used for external control through `DialectUiManagementProvider`
  return <BottomChat dialectId="dialect-bottom-chat" />;
}
```

And that's it! You should be good to go!

See below full examples for different types of UIs that can be added.

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
