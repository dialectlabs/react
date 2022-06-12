## ToC

- [Minimal context setup](#minimal-context-setup)
- [Full context setup](#full-context-setup)
- [Hooks](#hooks)

## Context initialization

### Minimal context setup

```ts
import type { DialectWalletAdapter } from '@dialectlabs/sdk';

const walletAdapter: DialectWalletAdapter = {
  signMessage: wallet.signMessage,
  ...
};

<DialectContext
  wallet={walletAdapter}
  environment="local-development"
>
  ...
</DialectContext>;
```

### Full context setup

```ts
import type { DialectWalletAdapter } from '@dialectlabs/sdk';

const walletAdapter: DialectWalletAdapter = {
  signMessage: wallet.signMessage,
  ...
};

<DialectContext
  wallet={walletAdapter}
  environment="local-development"
  solana={{
    network: "localnet",
    dialectProgramId: "D1ALECT",
    rpcUrl: "http://localhost:8899"
  }}
  dialectCloud={{
    environment: "local-development",
    url: "http://localhost:8080",
    tokenStore: new InMemoryTokenStore()
  }}
  preferableMessagingBackend={MessagingBackend.Solana}
>
  ...
</DialectContext>;
```

## Hooks

- [useDialectContext](#useDialectContext) - returns a dialect context value
- [useDialectSdk](#usedialectsdk) - exposes a low level, imperative dialect sdk
- [useThreads](#usethreads) - lists all available threads
- [useThread](#usethread) - finds thread
- [useThreadMessages](#usethreadmessages) - lists thread messages

#### useDialectContext

```ts
interface DialectContext {
  sdk: DialectSdk;
  connected: {
    wallet?: boolean;
    solana?: boolean;
    dialectCloud?: boolean;
  };
}

const ctx = useDialectContext();
```

#### useDialectSdk

```ts
interface DialectSdk {
  threads: Messaging;
  compatibility: CompatibilityProps;
}

const sdk = useDialectSdk();
const threads = await sdk.threads.findAll();
```

#### useThreads

```ts
// definition
interface UseThreadsParams {
  refreshInterval?: number;
}

interface UseThreadsValue {
  // sdk
  threads: Thread[];
  create(command: CreateThreadCommand): Promise<Thread>;
  // react-lib
  isFetchingThreads: boolean;
  errorFetchingThreads: DialectSdkError | null;
  isCreatingThread: boolean;
  errorCreatingThread: DialectSdkError | null;
}

const useThreads: (params?: UseThreadsParams) => UseThreadsValue;

// example
const { threads } = useThreads();
const { threads, create, isCreatingThread } = useThreads({
  refreshInterval: 3000,
});

create(params);
```

#### useThread

```ts
type ThreadSearchParams =
  | { address: PublicKey }
  | { otherMembers: PublicKey[] }
  // TODO
  | { twitterHandle: string }
  | { sns: string };

type UseThreadParams = { findParams: ThreadSearchParams };

interface UseThreadValue {
  // sdk
  thread: Omit<Thread, 'messages' | 'send' | 'delete'> | null;

  send(command: SendMessageCommand): Promise<void>;
  delete(): Promise<void>;

  // react-lib
  isFetchingThread: boolean;
  errorFetchingThread: DialectSdkError | null;
  isSendingMessage: boolean;
  errorSendingMessage: DialectSdkError | null;
  isDeletingThread: boolean;
  errorDeletingThread: DialectSdkError | null;
}

const useThread: (params: UseThreadParams) => UseThreadValue;

const thread = useThread({ findParams: { address: 'D1ALECT' } });
const thread = useThread({ findParams: { twitterHandle: '@saydialect' } });
const thread = useThread({ findParams: { sns: 'dialect.sol' } });
```

#### useThreadMessages

```ts
interface UseThreadMessagesParams {
  address: PubKey;
  refreshInterval?: number | null;
}

interface UseThreadMessagesValue {
  // sdk
  messages: Message[];

  // react-lib
  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
}

const { address } = useThread({ address: 'D1ALECT' });
const { messages } = useThreadMessages({ address, refreshInterval: 3000 });
```

#### general example

```ts
const threads = useThreads();

const { thread, delete, send} = useThread({ findParams: { address: 'D1ALECT' } });

await delete();
await send({ text: 'smth' });

const messages = useThreadMessages({
  address: thread.address,
  refreshInterval: 3000,
});
```
