import { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { display } from '@dialectlabs/web3';
import {
  getDialectAddressWithOtherMember,
  ParsedErrorData,
  useApi,
  useDialect,
} from '@dialectlabs/react';
import clsx from 'clsx';
import { A, H1, Input, P } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import {
  Button,
  Footer,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
} from '../../../../../common';
import { fetchAddressFromTwitterHandle } from '../../../../../DisplayAddress';
import { Lock, NoLock } from '../../../../../Icon';
import IconButton from '../../../../../IconButton';

interface CreateThreadProps {
  inbox?: boolean;
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
}

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

const showAddressInputStatus = (
  valid: boolean,
  address: string,
  cardinalAddress: string
) => {
  const { textStyles } = useTheme();

  if (!address) return CardinalCTA();

  const isTwitter = address.charAt(0) === '@';

  if (isTwitter && valid && cardinalAddress) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {cardinalAddress}
      </P>
    );
  }

  if (isTwitter && !valid && !cardinalAddress) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        No address is associated with this twitter handle
      </P>
    );
  }

  if (!isTwitter && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Invalid address or Twitter handle
      </P>
    );
  }

  if (!isTwitter && valid && !cardinalAddress) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        Valid address
      </P>
    );
  }

  if (!isTwitter && valid && cardinalAddress) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {cardinalAddress}
      </P>
    );
  }
};

export default function CreateThread({
  inbox,
  onNewThreadCreated,
  onCloseRequest,
  onModalClose,
}: CreateThreadProps) {
  const {
    createDialect,
    dialects,
    isDialectCreating,
    creationError,
    setDialectAddress,
  } = useDialect();
  const { program, network, wallet, walletName } = useApi();
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState('');
  const [cardinalAddress, setCardinalAddress] = useState('');
  const [encrypted, setEncrypted] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const createThread = async () => {
    const currentChatWithAddress = dialects.find((subscription) => {
      const otherMemebers = subscription?.dialect.members.filter(
        (member) =>
          member.publicKey.toString() !== wallet?.publicKey?.toString()
      );
      return (
        otherMemebers.length == 1 &&
        address == otherMemebers[0]?.publicKey.toString()
      );
    });
    if (currentChatWithAddress) {
      const currentThreadWithAddress =
        currentChatWithAddress.publicKey.toBase58();
      setDialectAddress(currentThreadWithAddress);
      onNewThreadCreated?.(currentThreadWithAddress);
      onCloseRequest?.();
      return;
    }

    const finalAddress = cardinalAddress || address;
    createDialect(finalAddress, [true, true], [false, true], encrypted)
      .then(async () => {
        const [da, _] = await getDialectAddressWithOtherMember(
          program,
          new anchor.web3.PublicKey(finalAddress)
        );
        setDialectAddress(da.toBase58());
        onNewThreadCreated?.(da.toBase58());
        onCloseRequest?.();
      })
      .catch((err) => {
        console.log('error creating dialect', err);
      });
  };

  const onAddressChange = (addr: string) => {
    setAddress(addr);
    setIsTyping(true);
  };

  const tryFetchAddressFromTwitterHandle = async (handle: string) => {
    const { result } = await fetchAddressFromTwitterHandle(
      program?.provider.connection,
      handle
    );

    if (result) {
      setValidAddress(true);
      setCardinalAddress(result.parsed.data.toBase58());
    } else {
      setValidAddress(false);
      setCardinalAddress('');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (address.length === 0) {
        setValidAddress(false);
      } else if (address.charAt(0) != '@') {
        try {
          new anchor.web3.PublicKey(address);
          setValidAddress(true);
          setCardinalAddress('');
        } catch (e) {
          await tryFetchAddressFromTwitterHandle(address);
        }
      } else {
        const handle = address.substring(1, address.length);
        await tryFetchAddressFromTwitterHandle(handle);
      }
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const disabled = !address || (!isTyping && !validAddress);

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-pt-2 dt-pb-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold dt-items-center">
        {/* TODO: replace with IconButton to be sematic */}
        <div
          className="dt-cursor-pointer"
          onClick={() => {
            onCloseRequest?.();
          }}
        >
          <icons.back />
        </div>
        Send Message
        <div>
          {!inbox && onModalClose && (
            <div className="sm:dt-hidden dt-ml-3">
              <IconButton icon={<icons.x />} onClick={onModalClose} />
            </div>
          )}
        </div>
      </div>

      <div className="dt-flex-1 dt-pb-8 dt-max-w-sm dt-m-auto dt-flex dt-flex-col">
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
          placeholder="D1AL...DY5h or @saydialect"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        {!isTyping
          ? showAddressInputStatus(validAddress, address, cardinalAddress)
          : CardinalCTA()}
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
