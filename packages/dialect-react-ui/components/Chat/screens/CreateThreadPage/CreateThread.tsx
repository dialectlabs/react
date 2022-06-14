import type { KeyboardEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { display } from '@dialectlabs/web3';
import type { Member } from '@dialectlabs/web3';
import {
  getDialectAddressWithOtherMember,
  ParsedErrorData,
  useApi,
  useDialect,
} from '@dialectlabs/react';
import type { DialectAccount } from '@dialectlabs/react';
import clsx from 'clsx';
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@bonfida/spl-name-service';
import { tryGetName as tryGetTwitterHandle } from '@cardinal/namespaces';
import { A, H1, Input, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import {
  Button,
  Footer,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
  fetchSolanaNameServiceName,
} from '../../../common';
import { fetchAddressFromTwitterHandle } from '../../../DisplayAddress';
import { Lock, NoLock } from '../../../Icon';
import { Header } from '../../../Header';
import { Connection, PublicKey } from '@solana/web3.js';
import debounce from '../../../../utils/debounce';
import { useChatInternal } from '../../provider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { useRoute } from '../../../common/providers/Router';

interface CreateThreadProps {
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
}

const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
);

const SNS_DOMAIN_EXT = '.sol';

function CardinalCTA() {
  const { textStyles } = useTheme();
  return (
    <P
      className={clsx(
        textStyles.small,
        'dt-opacity-60 dt-text-white dt-text dt-mt-1 dt-px-2'
      )}
    >
      {'Link your Twitter handle with '}
      <A
        href={'https://twitter.cardinal.so'}
        target="_blank"
        rel="noreferrer"
        className="dt-underline"
      >
        twitter.cardinal.so
      </A>
      {'.'}
    </P>
  );
}

function ActionCaption({
  creationError,
  encrypted,
}: {
  encrypted: boolean;
  creationError: ParsedErrorData | null;
}) {
  const { textStyles, xPaddedText } = useTheme();
  const { walletName } = useApi();

  if (creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN') {
    return (
      <P
        className={clsx(
          textStyles.small,
          xPaddedText,
          'dt-text-red-500 dt-mt-2'
        )}
      >
        {creationError.message}
      </P>
    );
  }

  if (walletName !== 'Sollet') {
    return (
      <P
        className={clsx(textStyles.small, xPaddedText, 'dt-text-left dt-mt-2')}
      >
        Use{' '}
        <A
          href="https://www.sollet.io/"
          target="_blank"
          className="dt-underline"
        >
          Sollet.io
        </A>{' '}
        wallet to send encrypted messages.
      </P>
    );
  }

  if (encrypted) {
    return (
      <P
        className={clsx(textStyles.small, xPaddedText, 'dt-text-left dt-mt-2')}
      >
        ⚠️ Sollet.io encryption standards in the browser are experimental. Do
        not connect a wallet with significant funds in it.
      </P>
    );
  }

  return null;
}

const AddressResult = ({
  valid,
  address,
  isTwitterHandle,
  isSNS,
  isYou,
  twitterHandle,
  snsDomain,
}: {
  valid: boolean;
  address?: string;
  isYou: boolean;
  isTwitterHandle: boolean;
  isSNS: boolean;
  twitterHandle: string | null;
  snsDomain: string | null;
}) => {
  const { textStyles } = useTheme();

  if (isYou) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Sorry, you couldn't message yourself currently
      </P>
    );
  }

  if (isTwitterHandle && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        No address is associated with this twitter handle
      </P>
    );
  }

  if (isSNS && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Couldn't find this SNS domain
      </P>
    );
  }

  if (!isTwitterHandle && !isSNS && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Invalid address, Twitter handle or SNS domain
      </P>
    );
  }

  // Valid states

  // TODO: isChecking
  if (valid && (isSNS || isTwitterHandle)) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {address}
      </P>
    );
  }

  if (valid && twitterHandle && snsDomain) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        SNS domain: {snsDomain}.sol / Twitter handle: {twitterHandle}
      </P>
    );
  }

  if (valid && snsDomain) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        SNS domain: {snsDomain}.sol
      </P>
    );
  }

  if (valid && twitterHandle) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        Twitter handle: {twitterHandle}
      </P>
    );
  }

  return (
    <P className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}>
      Valid address
    </P>
  );
};

const parseSNSDomain = (domainString: string): string | undefined => {
  domainString = domainString.trim();
  const isSNSDomain = domainString.match(SNS_DOMAIN_EXT);
  const domainName = domainString.slice(0, domainString.length - 4);
  if (!isSNSDomain || !domainName) return;
  return domainName;
};

const tryFetchSNSDomain = async (
  connection: Connection,
  domainName: string
): Promise<PublicKey | null> => {
  try {
    const hashedName = await getHashedName(domainName);

    const domainKey = await getNameAccountKey(
      hashedName,
      undefined,
      SOL_TLD_AUTHORITY
    );

    const { registry } = await NameRegistryState.retrieve(
      connection,
      domainKey
    );

    return registry?.owner;
  } catch (e) {
    return null;
  }
};

const parseTwitterHandle = (handleString: string): string | undefined => {
  handleString = handleString.trim();
  const isTwitter = handleString.startsWith('@');
  const handle = handleString.substring(1, handleString.length);
  if (!isTwitter || !handle) return;
  return handle;
};

const tryFetchAddressFromTwitterHandle = async (
  connection: Connection,
  handle: string
): Promise<PublicKey | null> => {
  try {
    const { result } = await fetchAddressFromTwitterHandle(connection, handle);

    return result?.parsed.data;
  } catch (e) {
    return null;
  }
};

const tryPublicKey = (addressString: string): PublicKey | null => {
  try {
    return new PublicKey(addressString);
  } catch (e) {
    return null;
  }
};

export default function CreateThread({
  onNewThreadCreated,
  onCloseRequest,
  onModalClose,
}: CreateThreadProps) {
  const { createDialect, dialects, isDialectCreating, creationError } =
    useDialect();
  const {
    current,
    params: { receiver },
  } = useRoute<{ receiver?: string }>();
  const { type, onChatOpen, dialectId } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const { program, network, wallet, walletName } = useApi();
  const connection = program?.provider.connection;
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState<string | null>(receiver ?? null);
  const [actualAddress, setActualAddress] = useState<PublicKey | null>(null);

  const [isTwitterHandle, setIsTwitterHandle] = useState(false);
  const [isSNS, setIsSNS] = useState(false);

  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [snsDomain, setSNSDomain] = useState<string | null>(null);

  const [encrypted, setEncrypted] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Accessing current here, since we need to set the address if the reference to `current` has changed (route has changed)
    if (!current || !receiver) return;
    setAddress(receiver);
  }, [current, receiver]);

  // TODO: useCallback
  const createThread = async () => {
    const currentChatWithAddress = dialects.find(
      (subscription: DialectAccount) => {
        const otherMembers = subscription?.dialect.members.filter(
          (member: Member) =>
            member.publicKey.toString() !== wallet?.publicKey?.toString()
        );
        return (
          otherMembers.length == 1 &&
          actualAddress?.toBase58() == otherMembers[0]?.publicKey.toString()
        );
      }
    );
    if (currentChatWithAddress) {
      const currentThreadWithAddress =
        currentChatWithAddress.publicKey.toBase58();

      onNewThreadCreated?.(currentThreadWithAddress);
      return;
    }

    createDialect(
      actualAddress?.toBase58(),
      [true, true],
      [false, true],
      encrypted
    )
      .then(async () => {
        const [da, _] = await getDialectAddressWithOtherMember(
          program,
          actualAddress
        );
        onNewThreadCreated?.(da.toBase58());
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.shiftKey == false) {
      e.preventDefault();
      await createThread();
    }
  };

  const onAddressChange = (addr: string) => {
    setAddress(addr);
    setIsTyping(true);
  };

  const findAddress = async (connection: Connection, addressString: string) => {
    if (!connection) {
      // TODO: set connection error
      return;
    }

    // Empty string
    if (addressString.length === 0) {
      setActualAddress(null);
      setIsValidAddress(false);
      setIsSNS(false);
      setIsTwitterHandle(false);
    }

    const twitterHandle = parseTwitterHandle(addressString);
    const snsDomain = parseSNSDomain(addressString);

    let addressFromSNS = null;
    let addressFromTwitter = null;
    let addressFromBase58 = null;

    try {
      // SNS DOMAIN, like sysy.sol
      if (snsDomain)
        addressFromSNS = await tryFetchSNSDomain(connection, snsDomain);

      // Twitter Handle (via cardinal.so)
      if (twitterHandle)
        addressFromTwitter = await tryFetchAddressFromTwitterHandle(
          connection,
          twitterHandle
        );
      // Just a base58 string
      addressFromBase58 = await tryPublicKey(addressString);
    } catch (e) {
      // console.log('Error parsing type of address');
    }

    const actualAddress =
      addressFromSNS || addressFromTwitter || addressFromBase58;
    setActualAddress(actualAddress);

    setIsSNS(Boolean(snsDomain));
    setIsTwitterHandle(Boolean(twitterHandle));
    setIsValidAddress(Boolean(actualAddress));

    setIsTyping(false);
  };

  const findAddressDebounced = useCallback(debounce(findAddress, 500), []);

  useEffect(() => {
    // When input address changes, we debounce
    findAddressDebounced(connection, address);
  }, [findAddressDebounced, connection, address]);

  useEffect(() => {
    const fetchReverse = async () => {
      if (!actualAddress || !connection) {
        setTwitterHandle('');
        setSNSDomain('');
        return;
      }

      let twitterName = null;
      let snsName = null;

      try {
        if (!isTwitterHandle)
          twitterName = await tryGetTwitterHandle(connection, actualAddress);
      } catch (e) {}

      try {
        if (!isSNS)
          snsName = await fetchSolanaNameServiceName(
            connection,
            actualAddress?.toBase58()
          );
      } catch (e) {}

      setTwitterHandle(twitterName ? twitterName : null);
      setSNSDomain(
        snsName && snsName?.solanaDomain ? snsName?.solanaDomain : null
      );
    };
    fetchReverse();
  }, [actualAddress, connection, isSNS, isTwitterHandle]);

  const disabled = !address || (!isTyping && !isValidAddress);

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <Header
        type={type}
        onClose={onModalClose}
        onOpen={onChatOpen}
        onHeaderClick={onChatOpen}
        isWindowOpen={ui?.open}
      >
        <Header.Icons containerOnly position="left">
          <Header.Icon
            icon={<icons.back />}
            onClick={() => onCloseRequest?.()}
          />
        </Header.Icons>
        <Header.Title>Send Message</Header.Title>
        <Header.Icons />
      </Header>

      <div className="dt-flex-1 dt-pb-8 dt-max-w-sm dt-m-auto dt-flex dt-flex-col dt-px-2">
        <H1
          className={clsx(
            textStyles.h1,
            colors.primary,
            'dt-text-center dt-mb-4 dt-mt-4'
          )}
        >
          Create thread
        </H1>
        <Input
          className={clsx(outlinedInput, 'dt-w-full dt-mb-1')}
          placeholder="D1AL...DY5h, @saydialect or dialect.sol"
          type="text"
          value={address ?? ''}
          onChange={(e) => {
            onAddressChange(e.target.value);
          }}
          onKeyDown={onEnterPress}
        />
        <div className="dt-mb-2">
          {isTyping || !address ? (
            <CardinalCTA />
          ) : (
            <AddressResult
              isYou={
                actualAddress?.toBase58() === wallet?.publicKey?.toBase58()
              }
              valid={isValidAddress}
              address={actualAddress?.toBase58()}
              isSNS={isSNS}
              isTwitterHandle={isTwitterHandle}
              twitterHandle={twitterHandle}
              snsDomain={snsDomain}
            />
          )}
        </div>
        <ValueRow
          label={
            <>
              Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}){' '}
              <NetworkBadge network={network} />
            </>
          }
          className={clsx('dt-w-full dt-mb-2')}
        >
          <span className="dt-text-right">{balance || 0} SOL</span>
        </ValueRow>
        <ValueRow
          label="Rent Deposit (recoverable)"
          className={clsx('dt-w-full')}
        >
          0.058 SOL
        </ValueRow>
        <P className={clsx(textStyles.body, 'dt-text-center dt-my-4')}>
          All messages are stored on chain, so to start this message thread,
          you&apos;ll need to deposit a small amount of rent. This rent is
          recoverable.
        </P>
        <div className="dt-flex dt-flex-row dt-gap-x-2 dt-w-full">
          <ValueRow
            label={
              encrypted ? (
                <span className="dt-flex dt-items-center">
                  <Lock className="dt-mr-1 dt-opacity-60" />
                  encrypted
                </span>
              ) : (
                <span className="dt-flex dt-items-center">
                  <NoLock className="dt-mr-1 dt-opacity-60" />
                  unencrypted
                </span>
              )
            }
            className="dt-flex-1"
          >
            <span className="dt-flex dt-items-center">
              <Toggle
                checked={encrypted}
                disabled={walletName !== 'Sollet'}
                onClick={() => setEncrypted((enc) => !enc)}
              />
            </span>
          </ValueRow>
          <Button
            onClick={createThread}
            loading={isDialectCreating}
            disabled={disabled}
          >
            {isDialectCreating ? 'Creating...' : 'Create thread'}
          </Button>
        </div>
        <ActionCaption encrypted={encrypted} creationError={creationError} />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
