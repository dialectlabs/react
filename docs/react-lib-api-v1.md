## ToC

### Context initialization

- [Minimal context setup](#minimal-context-setup)
- [Full context setup](#full-context-setup)
- [Hooks](#hooks)

### tbd

- thread preview
- dialect cloud api(crud addresses, code verify/resend)
- error handling
- group threads member api

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

- [useDialectSdk](#usedialectsdk) - exposes a low level, imperative dialect sdk
- [useThreads](#usethreads) - lists all available threads
- [useThread](#usethread) - finds thread
- [useThreadMessages](#usethreadmessages) - lists thread messages
- [setActiveThread](#setactivethread) - sets active dialect thread
- [useActiveThread](#useactivethread) - returns active dialect thread

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
  | { address: PublicKey }
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

const thread = useThread({ address: 'D1ALECT' });
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

const { address } = useThread({ address: 'D1ALECT' });
const { messages } = useThreadMessages({ address, refreshInterval: 3000 });
```

#### general example

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
