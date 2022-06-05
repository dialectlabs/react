## ToC

### Context initialization

- [Minimal context setup](#minimal-context-setup)
- [Possible context configuration](#possible-context-configuration)

### Hooks

- [Low level hooks](#low-level-hooks)
- [High level hooks](#high-level-hooks)

### tbd

- thread preview
- dialect cloud api(crud addresses, code verify/resend)

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

### Possible context configuration

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
>
  ...
</DialectContext>;
```

## Hooks

### Low level hooks

Low level hooks are mainly exposes the initialized `@dialect/sdk` api.

- [useDialectSdk](#usedialectsdk) - exposes a low level, imperative dialect sdk from the context
- [useMessaging](#usemessaging) - exposes `Messaging` interface from dialect sdk
- [useThreads](#usethreads) - lists all available threads
- [useThread](#usethread) - finds thread
- [useThreadMessages](#usethreadmessages) - finds thread messages

#### useDialectSdk

```ts
interface DialectSdk {
  threads: Messaging;
  connected: {
    wallet: boolean;
    solana?: boolean;
    dialectCloud?: boolean;
  };
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
  create(command: CreateDialectCommand): Promise<Thread>;
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
  | { publicKey: PublicKey }
  | { twitterHandle: string }
  | { sns: string };

type UseThreadParams = ThreadSearchParams & {};

interface UseThreadValue {
  // sdk
  address: PublicKey;
  me: DialectMember;
  otherMember: DialectMember;
  encryptionEnabled: boolean;
  canBeDecrypted: boolean;

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

const thread = useThread({ publicKey: 'D1ALECT' });
const thread = useThread({ twitterHandle: '@saydialect' });
const thread = useThread({ sns: 'dialect.sol' });
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

const { address } = useThread({ publicKey: 'D1ALECT' });
const { messages } = useThreadMessages({ address, refreshInterval: 3000 });
```

```ts
const threads = useThreads();

const thread = useThread({ publicKey: 'pubKey' });
const thread = useThread({ twitterHandle: '@saydialect' });
const thread = useThread({ sns: 'dialect.sol' });

await thread.delete();
await thread.send({ text: 'smth' });

const messages = useThreadMessages(thread);

const messages = useThreadMessages({
  address: thread.address,
  refreshInterval: 3000,
});
```

### High level hooks

- [setActiveThread](#setactivethread) - sets active thread
- [useActiveThread](#useactivethread) - returns data from thread

#### setActiveThread

```ts
// definition
interface SetActiveThreadParams {
  address: PublicKey | null;
}

const setActiveThread: (params: SetActiveThreadParams) => void;

// example
const { address } = useThread({ sns: 'dialect.sol' });
setActiveThread({ address: 'D1ALECT' });
```

#### useActiveThread

```ts
interface ActiveThread {
  // sdk
  address: PublicKey;
  me: DialectMember;
  otherMember: DialectMember;
  encryptionEnabled: boolean;
  canBeDecrypted: boolean;
  messages: Message[];

  send(command: SendMessageCommand): Promise<void>;
  delete(): Promise<void>;

  // react-lib
  isFetchingThread: boolean;
  errorFetchingThread: DialectSdkError | null;
  isSendingMessage: boolean;
  errorSendingMessage: DialectSdkError | null;
  isDeletingThread: boolean;
  errorDeletingThread: DialectSdkError | null;
  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
}

const thread = useActiveThread();
```
