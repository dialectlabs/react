import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import QRCodeStyling from '@solana/qr-code-styling';
import {
  createQROptions,
  createTransfer,
  findReference,
  validateTransfer,
} from '@solana/pay';
import useSWR from 'swr';
import { MessageType, useApi } from '@dialectlabs/react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { QRCodeDone, SolanaPay as SolanaPayIcon } from '../Icon';
import LinkifiedText from './LinkifiedText';
import { Button, Loader, ValueRow } from './primitives';
import { P } from './preflighted';
import { useTheme } from './ThemeProvider';
import clsx from 'clsx';

function base64ToUint8(string: string): Uint8Array {
  return new Uint8Array(
    atob(string)
      .split('')
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
}

const fetcher = (url, options) => fetch(url, options).then((r) => r.json());

type PropsType = {
  message: MessageType;
};

type V1PropType = {
  transferUrl: URL;
  amount: BigNumber;
  recipient: PublicKey;
  reference: PublicKey;
  icon: string;
  provider: string;
};

type V2PropType = {
  transactionUrl: URL | null;
};

type SolanaPayWidgetProps = {
  amount: BigNumber;
  recipient: PublicKey;
  reference?: PublicKey;
};

type SolanaPayObj = V1PropType | V2PropType;

export function findTransferUrl(str: string): URL | undefined {
  const regex = /(solana:\S+)/;
  try {
    const match = str.match(regex);
    const matched = match?.[0];
    if (!match || !matched) return;
    if (matched.includes('https')) return;
    const url = new URL(matched);

    return url;
  } catch (e) {
    console.log('Error: not a solana pay transfer url', e);
  }
}

export function findTransactionUrl(str: string): URL | undefined {
  const regex = /(solana:\S+)/;
  try {
    const match = str.match(regex);
    const matched = match?.[0];
    if (!match || !matched) return;
    if (!matched.includes('https')) return;
    const url = new URL(matched.replace('solana:', ''));
    return url;
  } catch (e) {
    console.log('There are not solana pay transactions urls', e);
  }
}

export function parseTransferUrl(url: URL): SolanaPayWidgetProps | null {
  try {
    const reference = url.searchParams.get('reference') || '';
    const amount = parseFloat(url.searchParams.get('amount') || '');
    return {
      recipient: new PublicKey(url.pathname),
      amount: new BigNumber(amount),
      reference: reference ? new PublicKey(reference) : undefined,
      // TODO: store icon locally
      icon: 'https://localhost:3001/solana-pay-logo.svg',
    };
  } catch (e) {
    console.log('not transfer pay', e);
    return null;
  }
}

export function parseSolanaUrl(url: URL): SolanaPayWidgetProps | null {
  try {
    const recipient = url.searchParams.get('recipient') || '';
    const reference = url.searchParams.get('reference') || '';
    const amount = parseFloat(url.searchParams.get('amount') || '');
    return {
      recipient: new PublicKey(recipient),
      amount: new BigNumber(amount),
      reference: reference ? new PublicKey(reference) : undefined,
    };
  } catch (e) {
    console.log('not transfer pay', e);
    return null;
  }
}

export function parseMtnPayUrl(url: URL): SolanaPayWidgetProps | null {
  try {
    // TODO: take tokenType into account
    const referenceString = url.searchParams.get('reference') || '';
    console.log({ referenceString });
    return {
      recipient: new PublicKey(url.searchParams.get('wallet') || ''),
      amount: new BigNumber(parseFloat(url.searchParams.get('size') || '')),
      reference: referenceString ? new PublicKey(referenceString) : undefined,
    };
  } catch (e) {
    console.log('not solana pay', e);
    return null;
  }
}

export function SolanaPayQRCode({
  href,
  isPaid,
}: {
  href: string;
  isPaid: boolean;
}) {
  const ref = useRef<HTMLElement & SVGSVGElement>(null);
  const options = useMemo(
    () => createQROptions(href, undefined, 'transparent', 'white'),
    [href]
  );

  const qr = useMemo(() => new QRCodeStyling(), []);
  useEffect(() => qr.update(options), [qr, options]);
  useEffect(() => {
    if (ref.current) {
      qr.append(ref.current as HTMLElement);
    }
  }, [ref, qr]);

  if (isPaid) {
    return <QRCodeDone className="dt-shrink-0 dt-basis-2/5" />;
  }

  return (
    <svg className="dt-shrink-0 dt-basis-2/5" viewBox="0 0 512 512" ref={ref} />
  );
}

export function SolanaPayWidget({
  transferUrl,
  transactionUrl,
  provider,
  amount,
  icon,
  recipient,
  reference,
}: SolanaPayObj) {
  const { program, wallet } = useApi();
  const { colors } = useTheme();
  const connection = program!.provider.connection;
  const [isConfirmed, setConfirmed] = useState(false);
  const [isChecking, setChecking] = useState(false);
  const [isSending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const [txReference, setTxReference] = useState<string | null>(null);

  const fetchReference = async (referenceString: string) => {
    const refff = await findReference(
      connection,
      new PublicKey(referenceString),
      { finality: 'confirmed' }
    );
    return refff;
  };

  const shouldFetch = !txReference && reference;

  // TODO: replace with mtnPay `ref` and status
  const { data: referenceData, error: referenceError } = useSWR(
    shouldFetch ? [reference] : null,
    fetchReference,
    {
      refreshInterval: 250,
      onSuccess: (data) => {
        setChecking(true);
        console.log('on success data', data);
        setTxReference(data.signature);
      },
    }
  );

  useEffect(() => {
    if (!txReference) return;
    const checkConfirmed = async () => {
      try {
        const transactionResponse = await validateTransfer(
          connection,
          txReference,
          {
            recipient,
            amount,
            reference,
          }
        );
        setConfirmed(Boolean(transactionResponse));
      } catch (e) {
        setError(e);
      } finally {
        setChecking(false);
        setSending(false);
      }
    };
    checkConfirmed();
  }, [txReference]);

  const { data: { icon: fetchedIcon, label } = {}, error: transactionError } =
    useSWR(transactionUrl ? [transactionUrl] : null, fetcher);

  const handleTransfer = useCallback(async () => {
    if (!wallet || !wallet?.publicKey || !wallet?.sendTransaction) return;
    let transaction = null;

    setSending(true);

    try {
      if (transactionUrl) {
        // Fetch transaction
        const { transaction: transactionHash } = await fetcher(transactionUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ account: wallet.publicKey }),
        });
        transaction = Transaction.from(base64ToUint8(transactionHash));
        transaction.instructions[0].keys.push({
          pubkey: reference,
          isWritable: false,
          isSigner: false,
        });
        // debugger;
        // console.log(transaction.instructions);
      } else {
        // Create transaction locally
        transaction = await createTransfer(connection, wallet?.publicKey, {
          recipient,
          amount,
          // splToken,
          // reference,
          // memo,
        });
      }

      if (!transaction) return;

      await wallet?.sendTransaction(transaction, connection);
    } catch (e) {
      console.log('Error', e);
    }
  }, []);

  const isPaid = Boolean(txReference && isConfirmed);

  const areYouRecipient =
    recipient.toBase58() === wallet?.publicKey?.toBase58();
  if (areYouRecipient) {
    return (
      <P
        className={clsx(
          'dt-text-sm dt-font-bold mb-2 dt-h-[42px] dt-flex dt-justify-center dt-items-center dt-rounded-lg dt-mt-2 dt-px-2',
          colors.highlight
        )}
      >
        {!isPaid ? (
          <P className="dt-text-sm mb-2 dt-font-bold">
            You sent a request for {amount ? amount.toNumber() : ''} SOL
          </P>
        ) : (
          <P className="dt-text-sm mb-2 dt-font-bold">
            ✓ You recieved {amount ? amount.toNumber() : ''} SOL
          </P>
        )}
      </P>
    );
  }

  // TODO: use our primitives
  return (
    <div className="dt-text-left dt-my-2 dt-flex flex-col">
      <div className="dt-border dt-border-neutral-700 dt-rounded dt-my-2 dt-flex dt-flex-row dt-space-x-2 dt-p-2">
        <SolanaPayQRCode
          isPaid={isPaid}
          href={
            transferUrl?.href ||
            (transactionUrl?.href ? 'solana:' + transactionUrl?.href : null)
          }
        />
        <div className="dt-flex dt-flex-col dt-justify-between dt-pt-1 dt-pb-2">
          <div className="dt-flex dt-flex-col dt-space-y-2">
            <P className="dt-text-xs">
              {isPaid
                ? 'You successfully paid this transfer request'
                : 'Scan this code with your approved Solana wallet'}
            </P>
            {!provider ? (
              <P className="dt-text-xs dt-opacity-50">
                {!isPaid
                  ? "You'll be asked to confirm the transaction"
                  : 'Scan the QR code to view your receipt'}
              </P>
            ) : (
              <P className="dt-text-xs">
                <div className="flex">
                  {fetchedIcon && (
                    <img className="dt-w-4 dt-h-4 dt-mr-1" src={fetchedIcon} />
                  )}
                  <span className="dt-opacity-50">{provider}</span>
                </div>
              </P>
            )}
          </div>

          <P className="dt-text-xs dt-flex">
            <span className="dt-opacity-50">Powered by </span>
            <SolanaPayIcon className="dt-w-auto dt-h-4" />
          </P>
        </div>
      </div>
      {/* {!isPaid ? ( */}
      <Button
        onClick={handleTransfer}
        className=" dt-rounded-sm dt-py-2 dt-font-bold dt-inline-flex dt-justify-center"
        loading={isSending}
        disabled={isPaid}
      >
        {/* TODO: checkmark */}
        {isPaid
          ? `You sent ◎${amount ? amount.toNumber().toFixed(2) : ''}`
          : `Send${amount ? ` ◎${amount.toNumber().toFixed(2)}` : ''}`}
      </Button>
    </div>
  );
}

export default function MessageContent(props: PropsType) {
  const [solanaPayObj, setSolanaPayObj] = useState<SolanaPayWidgetProps | null>(
    null
  );

  const transferUrl = findTransferUrl(props.message.text);
  const transactionUrl = findTransactionUrl(props.message.text);
  let provider;
  if (transactionUrl) {
    provider = transactionUrl.hostname;
  }

  useEffect(() => {
    if (transferUrl) {
      setSolanaPayObj(parseTransferUrl(transferUrl));
      return;
    }
    if (transactionUrl) {
      setSolanaPayObj(parseMtnPayUrl(transactionUrl));
      return;
    }
  }, [props.message.text]);
  const text = props.message.text.replace(/(solana:\S+)/, '');

  return (
    <div className="dt-flex dt-flex-col">
      <LinkifiedText>{text}</LinkifiedText>
      {/* TODO: optimize rerender */}
      {solanaPayObj && (
        <SolanaPayWidget
          provider={provider}
          transferUrl={transferUrl}
          transactionUrl={transactionUrl}
          {...solanaPayObj}
        />
      )}
      {/* Debugging */}
      {/* <span className="dt-opacity-50">{props.message.text}</span> */}
    </div>
  );
}
