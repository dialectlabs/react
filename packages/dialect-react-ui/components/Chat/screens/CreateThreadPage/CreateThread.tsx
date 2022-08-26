import {
  Backend,
  ThreadId,
  ThreadMemberScope,
  useDialectConnectionInfo,
  useDialectSdk,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import useBalance from '../../../../hooks/useBalance';
import debounce from '../../../../utils/debounce';
import { shortenAddress } from '../../../../utils/displayUtils';
import tryPublicKey from '../../../../utils/tryPublicKey';
import {
  Button,
  Divider,
  Footer,
  NetworkBadge,
  Toggle,
  ValueRow,
} from '../../../common';
import { H1, Input, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { useRoute } from '../../../common/providers/Router';
import { Header } from '../../../Header';
import { Encrypted, Unencrypted } from '../../../Icon';
import { useChatInternal } from '../../provider';
import ActionCaption from './ActionCaption';
import AddressResult from './AddressResult';
import LinkingCTA from './LinkingCTA';

interface CreateThreadProps {
  onNewThreadCreated?: (threadId: ThreadId) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
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
      apiAvailability: { canEncrypt },
    },
    identity,
  } = useDialectSdk();
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState<string>(receiver || '');
  const [actualAddress, setActualAddress] = useState<PublicKey | null>(null);

  const [encrypted, setEncrypted] = useState(false);
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
    findAddress(receiver);
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

  const findAddress = async (addressString: string) => {
    try {
      if (!addressString) {
        setActualAddress(null);
        return;
      }

      const isPk = tryPublicKey(addressString);
      if (isPk) {
        if (wallet.publicKey && isPk.equals(wallet.publicKey)) {
          setActualAddress(null);
          return;
        }
        setActualAddress(isPk);
        return;
      }

      const potentialIdentity = await identity.resolveReverse(addressString);

      if (potentialIdentity) {
        setActualAddress(potentialIdentity.publicKey);
        return;
      }

      setActualAddress(null);
    } finally {
      setIsTyping(false);
    }
  };

  const findAddressDebounced = useCallback(debounce(findAddress, 700), []);

  const onAddressChange = (addr: string) => {
    setAddress(addr);
    setIsTyping(true);
    findAddressDebounced(addr);
  };

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
            colors.textPrimary,
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
          value={address}
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
            <AddressResult publicKey={actualAddress} />
          )}
        </div>
        <Divider className="dt-my-2 dt-opacity-20" />
        {isBackendSelectable ? (
          <ValueRow
            className="dt-mb-2"
            label={
              isOffChain ? (
                <span className="dt-flex dt-items-center">
                  💬&nbsp;&nbsp;Off-chain
                </span>
              ) : (
                <span className="dt-flex dt-items-center">
                  ⛓&nbsp;&nbsp;On-chain
                </span>
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
                  Balance (
                  {wallet?.publicKey ? shortenAddress(wallet.publicKey) : ''}
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
                  <Encrypted className="dt-w-4 dt-h-6 dt-mr-1 dt-opacity-60" />
                  Encrypted
                </span>
              ) : (
                <span className="dt-flex dt-items-center">
                  <Unencrypted className="dt-w-4 dt-h-6 dt-mr-1 dt-opacity-60" />
                  Unencrypted
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
            disabled={isCreatingThread || !actualAddress}
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
