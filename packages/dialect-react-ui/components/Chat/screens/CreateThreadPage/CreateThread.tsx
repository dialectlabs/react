import { tryGetName as tryGetTwitterHandle } from '@cardinal/namespaces';
import {
  Backend,
  ThreadId,
  ThreadMemberScope,
  useDialectConnectionInfo,
  useDialectSdk,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import { display } from '@dialectlabs/web3';
import clsx from 'clsx';
import type { Connection, PublicKey } from '@solana/web3.js';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import debounce from '../../../../utils/debounce';
import {
  Button,
  Divider,
  fetchSolanaNameServiceName,
  Footer,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
} from '../../../common';
import { A, H1, Input, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { useRoute } from '../../../common/providers/Router';
import { Header } from '../../../Header';
import { Lock, NoLock } from '../../../Icon';
import { useChatInternal } from '../../provider';
import tryPublicKey from '../../../../utils/tryPublicKey';
import {
  parseTwitterHandle,
  tryFetchAddressFromTwitterHandle,
} from '../../../../utils/cardinalUtils';
import { parseSNSDomain, tryFetchSNSDomain } from '../../../../utils/SNSUtils';
import AddressResult from './AddressResult';
import ActionCaption from './ActionCaption';

interface CreateThreadProps {
  onNewThreadCreated?: (threadId: ThreadId) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
}

function LinkingCTA() {
  const { textStyles } = useTheme();
  return (
    <P
      className={clsx(
        textStyles.small,
        'dt-opacity-60 dt-text-white dt-text dt-mt-1 dt-px-2'
      )}
    >
      {'Link twitter '}
      <A
        href={'https://twitter.cardinal.so'}
        target="_blank"
        rel="noreferrer"
        className="dt-underline"
      >
        twitter.cardinal.so
      </A>
      {' and domain '}
      <A
        href={'https://naming.bonfida.org'}
        target="_blank"
        rel="noreferrer"
        className="dt-underline"
      >
        naming.bonfida.org
      </A>
    </P>
  );
}

export default function CreateThread({
  onNewThreadCreated,
  onCloseRequest,
  onModalClose,
}: CreateThreadProps) {
  const { create, isCreatingThread, errorCreatingThread } = useThreads();

  const {
    current,
    params: { receiver },
  } = useRoute<{ receiver?: string }>();
  const { type, onChatOpen, dialectId } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const {
    info: {
      wallet,
      config: { solana },
      solana: { dialectProgram },
      apiAvailability: { canEncrypt },
    },
  } = useDialectSdk();
  const connection = dialectProgram?.provider.connection;
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState<string | null>(receiver ?? '');
  const [actualAddress, setActualAddress] = useState<PublicKey | null>(null);

  const [isTwitterHandle, setIsTwitterHandle] = useState(false);
  const [isSNS, setIsSNS] = useState(false);

  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [snsDomain, setSNSDomain] = useState<string | null>(null);

  const [encrypted, setEncrypted] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // TODO: default to preferred backend
  const {
    connected: {
      solana: { shouldConnect: isSolanaShouldConnect },
      dialectCloud: { shouldConnect: isDialectCloudShouldConnect },
    },
  } = useDialectConnectionInfo();

  const isBackendSelectable =
    isSolanaShouldConnect && isDialectCloudShouldConnect;
  const [isOffChain, setIsOffChain] = useState(isDialectCloudShouldConnect);

  const backend =
    !isOffChain && isSolanaShouldConnect
      ? Backend.Solana
      : Backend.DialectCloud;

  // FIXME: handle error if [] passed
  const { thread: currentChatWithMember } = useThread({
    findParams: { otherMembers: actualAddress ? [actualAddress] : [] },
  });

  useEffect(() => {
    // Accessing current here, since we need to set the address if the reference to `current` has changed (route has changed)
    if (!current || !receiver) return;
    setAddress(receiver);
  }, [current, receiver]);

  // TODO: useCallback
  const createThread = async () => {
    if (!actualAddress) {
      return;
    }

    if (currentChatWithMember && currentChatWithMember.backend === backend) {
      // FIXME: show error even for diffrent backends
      onNewThreadCreated?.(currentChatWithMember.id);
      return;
    }

    create({
      me: { scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE] },
      otherMembers: [
        { publicKey: actualAddress, scopes: [ThreadMemberScope.WRITE] },
      ],
      encrypted,
      // TODO: could select only if multiple provided
      backend,
    })
      .then(async (thread) => {
        onNewThreadCreated?.(thread.id);
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

  const findAddress = async (
    connection: Connection | undefined,
    addressString: string
  ) => {
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

  // TODO: Fix Eslint
  const findAddressDebounced = useCallback(debounce(findAddress, 500), []);

  useEffect(() => {
    // When input address changes, we debounce
    findAddressDebounced(connection, address ?? '');
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

  const disabled = !actualAddress || (!isTyping && !isValidAddress);

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

      <div className="dt-flex-1 dt-pb-8 dt-max-w-sm dt-min-w-[24rem] dt-m-auto dt-flex dt-flex-col dt-px-2">
        <H1
          className={clsx(
            textStyles.h1,
            colors.primary,
            'dt-text-center dt-mb-4 dt-mt-8'
          )}
        >
          Create thread
        </H1>
        <P className={clsx(textStyles.small, 'dt-mb-2 dt-px-2')}>
          Enter recipient address, SNS domain or linked Twitter handle
        </P>
        <Input
          className={clsx(outlinedInput, 'dt-w-full dt-mb-1')}
          placeholder="D1AL...DY5h, @saydialect or dialect.sol"
          type="text"
          value={address ?? ''}
          onChange={(e) => {
            onAddressChange(e.target.value);
          }}
          onKeyDown={onEnterPress}
          disabled={isCreatingThread}
        />
        <div className="dt-mb-2">
          {isTyping || !address ? (
            <LinkingCTA />
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
        <Divider className="dt-my-2 dt-opacity-20" />
        {isBackendSelectable ? (
          <ValueRow
            className="dt-mb-2"
            label={
              isOffChain ? (
                <span className="dt-flex dt-items-center">💬 Off-chain</span>
              ) : (
                <span className="dt-flex dt-items-center">⛓ On-chain</span>
              )
            }
          >
            <span className="dt-flex dt-items-center">
              <Toggle
                checked={isOffChain}
                onClick={() => setIsOffChain((enc) => !enc)}
              />
            </span>
          </ValueRow>
        ) : null}
        {!isOffChain ? (
          <>
            <ValueRow
              label={
                <>
                  Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}
                  ) <NetworkBadge network={solana?.network} />
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
            <P className={clsx(textStyles.small, 'dt-my-4 dt-px-2')}>
              All messages are stored on chain, so to start this message thread,
              you&apos;ll need to deposit a small amount of rent. This rent is
              recoverable.
            </P>
          </>
        ) : null}
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
                disabled={!canEncrypt}
                onClick={() => setEncrypted((enc) => !enc)}
              />
            </span>
          </ValueRow>
          <Button
            onClick={createThread}
            loading={isCreatingThread}
            disabled={disabled}
          >
            {isCreatingThread ? 'Creating...' : 'Create thread'}
          </Button>
        </div>
        <ActionCaption
          encrypted={encrypted}
          creationError={errorCreatingThread}
        />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
