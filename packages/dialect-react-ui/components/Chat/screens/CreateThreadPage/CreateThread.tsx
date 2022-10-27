import {
  AccountAddress,
  DIALECT_API_TYPE_DIALECT_CLOUD,
  ThreadId,
  ThreadMemberScope,
  useDialectSdk,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import debounce from '../../../../utils/debounce';
import { Button, Divider, Footer, Toggle, ValueRow } from '../../../common';
import { H1, P } from '../../../common/preflighted';
import OutlinedInput from '../../../common/primitives/OutlinedInput';
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
    blockchainSdk: {
      type: blockchainSdkType,
      info: { supportsOnChainMessaging },
    },
    encryptionKeysProvider,
    identity,
  } = useDialectSdk();
  const canEncrypt = encryptionKeysProvider.isAvailable();

  const { colors, textStyles, icons } = useTheme();

  const [potentialOtherMemberAddress, setPotentialOtherMemberAddress] =
    useState<string>(receiver || '');
  const [actualAddress, setActualAddress] = useState<AccountAddress | null>(
    null
  );

  const [encrypted, setEncrypted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isBackendSelectable = supportsOnChainMessaging;
  const [isOnChain, setIsOnChain] = useState(false);

  // FIXME: handle error if [] passed
  const { thread: currentChatWithMember } = useThread({
    findParams: { otherMembers: actualAddress ? [actualAddress] : [] },
  });

  useEffect(() => {
    // Accessing current here, since we need to set the address if the reference to `current` has changed (route has changed)
    if (!current || !receiver) return;
    setPotentialOtherMemberAddress(receiver);
    findAddress(receiver);
  }, [current, receiver]);

  // TODO: useCallback
  const createThread = async () => {
    if (!actualAddress) {
      return;
    }

    if (currentChatWithMember) {
      // FIXME: show error even for diffrent backends
      onNewThreadCreated?.(currentChatWithMember.id);
      return;
    }

    create({
      me: { scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE] },
      otherMembers: [
        { address: actualAddress, scopes: [ThreadMemberScope.WRITE] },
      ],
      encrypted,
      // undefined should fallback to dialect cloud
      type: isOnChain ? blockchainSdkType : DIALECT_API_TYPE_DIALECT_CLOUD,
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

      const potentialIdentity = await identity.resolveReverse(addressString);

      if (potentialIdentity) {
        setActualAddress(potentialIdentity.address);
        return;
      }

      setActualAddress(addressString);
    } finally {
      setIsTyping(false);
    }
  };

  const findAddressDebounced = useCallback(debounce(findAddress, 700), []);

  const onAddressChange = (addr: string) => {
    setPotentialOtherMemberAddress(addr);
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
        <OutlinedInput
          placeholder="D1AL...DY5h, @saydialect or dialect.sol"
          type="text"
          value={potentialOtherMemberAddress}
          onChange={(e) => {
            onAddressChange(e.target.value);
          }}
          onKeyDown={onEnterPress}
          disabled={isCreatingThread}
        />
        <div className="dt-mb-2">
          {isTyping || !potentialOtherMemberAddress ? (
            <LinkingCTA />
          ) : (
            <AddressResult address={actualAddress} />
          )}
        </div>
        <Divider className="dt-my-2 dt-opacity-20" />
        {isBackendSelectable ? (
          <ValueRow
            className="dt-mb-2"
            label={
              isOnChain ? (
                <span className="dt-flex dt-items-center">
                  ⛓&nbsp;&nbsp;On-chain
                </span>
              ) : (
                <span className="dt-flex dt-items-center">
                  💬&nbsp;&nbsp;Off-chain
                </span>
              )
            }
          >
            <span className="dt-flex dt-items-center">
              <Toggle
                checked={!isOnChain}
                onClick={() => setIsOnChain((enc) => !enc)}
              />
            </span>
          </ValueRow>
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
