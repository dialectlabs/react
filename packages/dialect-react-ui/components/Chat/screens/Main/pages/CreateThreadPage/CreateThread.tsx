import { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { display } from '@dialectlabs/web3';
import {
  connected,
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
  fetchSolanaNameServiceName,
} from '../../../../../common';
import { fetchAddressFromTwitterHandle } from '../../../../../DisplayAddress';
import { Lock, NoLock } from '../../../../../Icon';
import IconButton from '../../../../../IconButton';
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@bonfida/spl-name-service';
import { tryGetName } from '@cardinal/namespaces';

interface CreateThreadProps {
  inbox?: boolean;
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
}

const SOL_TLD_AUTHORITY = new anchor.web3.PublicKey(
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
  isTyping,
  valid,
  address,
  cardinalAddress,
  snsAddress,
  twitterHandle,
  snsDomain,
}: {
  isTyping: boolean;
  valid: boolean;
  address: string;
  cardinalAddress: string;
  snsAddress: string;
  twitterHandle: string;
  snsDomain: string;
}) => {
  const { textStyles } = useTheme();

  const isTwitter = address.charAt(0) === '@';
  const isSNS = address.match(SNS_DOMAIN_EXT);

  if (isTyping || !address) {
    return <CardinalCTA />;
  }

  // TODO: isChecking

  if (isSNS && valid && snsAddress) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {snsAddress}
      </P>
    );
  }

  if (valid && twitterHandle && snsDomain) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {`SNS domain: ${snsDomain}.sol / Twitter handle: ${twitterHandle}`}
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
        Invalid address, Twitter handle or Solana domain
      </P>
    );
  }

  return (
    <P className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}>
      Valid address
    </P>
  );
};

const fetchSNSDomain = async (
  connection: anchor.web3.Connection,
  domainName: string
) => {
  const hashedName = await getHashedName(domainName);

  const domainKey = await getNameAccountKey(
    hashedName,
    undefined,
    SOL_TLD_AUTHORITY
  );

  const { registry } = await NameRegistryState.retrieve(connection, domainKey);

  return registry?.owner;
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
  const [snsAddress, setSNSAddress] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [snsDomain, setSNSDomain] = useState('');
  const [encrypted, setEncrypted] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // TODO: useCallback
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

    const finalAddress = cardinalAddress || snsAddress || address;
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  };

  // TODO: useCallback
  const onAddressChange = (addr: string) => {
    setAddress(addr);
    setIsTyping(true);
  };

  // TODO: useCallback
  const tryFetchAddressFromTwitterHandle = async (handle: string) => {
    try {
      const { result } = await fetchAddressFromTwitterHandle(
        program?.provider.connection,
        handle
      );

      if (result) {
        setIsValidAddress(true);
        setCardinalAddress(result.parsed.data.toBase58());
      } else {
        setIsValidAddress(false);
        setCardinalAddress('');
      }
    } catch (e) {
      setIsValidAddress(false);
      setCardinalAddress('');
    }
  };

  useEffect(() => {
    const checkInput = async () => {
      // Empty string
      if (address.length === 0) {
        return { isValid: false, sns: null };
      }

      if (!program?.provider.connection) {
        // TODO: set connection error
        return;
      }
      const connection = program?.provider.connection;

      // SNS DOMAIN
      const isSNSDomain = address.match(SNS_DOMAIN_EXT);
      if (isSNSDomain) {
        try {
          const snsDomainString = address.slice(0, address.length - 4);
          const snsDomain = await fetchSNSDomain(connection, snsDomainString);

          if (snsDomain) {
            setIsValidAddress(true);
            setSNSAddress(snsDomain?.toString());
          }
        } catch (e) {
          // console.log('Error retrieving SNS domain', e);
        } finally {
          setIsTyping(false);
        }
        return;
      }

      // Twitter Handle (via cardinal.so)
      const isTwitter = address.startsWith('@');
      const handle = address.substring(1, address.length);
      if (isTwitter && handle.length) {
        await tryFetchAddressFromTwitterHandle(handle);
        setIsTyping(false);
      }

      // Just a base58 address
      let pubKey: anchor.web3.PublicKey | null = null;
      try {
        pubKey = new anchor.web3.PublicKey(address);
        setCardinalAddress('');
        setIsValidAddress(true);
      } catch (e) {
        setIsValidAddress(false);
      } finally {
        setIsTyping(false);
      }

      // TODO: Fix typing on promise result
      if (pubKey) {
        const [twitterName, snsName]: any = await Promise.all([
          tryGetName(connection, pubKey),
          fetchSolanaNameServiceName(connection, address),
        ]).catch((e) => {
          setTwitterHandle('');
          setSNSDomain('');
        });

        if (twitterName && snsName) {
          setTwitterHandle(twitterName);
          setSNSDomain(snsName.solanaDomain);
        }
      }
    };
    const delayDebounceFn = setTimeout(checkInput, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const disabled = !address || (!isTyping && !isValidAddress);

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
          placeholder="D1AL...DY5h, @saydialect or dialect.sol"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        <div className="dt-mb-2">
          <AddressResult
            {...{
              isTyping,
              valid: isValidAddress,
              address,
              cardinalAddress,
              snsAddress,
              twitterHandle,
              snsDomain,
            }}
          />
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
