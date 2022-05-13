import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import LinkifiedText from './LinkifiedText';
import QRCodeStyling from '@solana/qr-code-styling';
import { createQROptions, createTransfer, findReference } from '@solana/pay';
import useSWR from 'swr';
import { MessageType, useApi } from '@dialectlabs/react';
import { PublicKey } from '@solana/web3.js';

type PropsType = {
  message: MessageType;
};

type SolanaPropType = {
  href: string;
  amount: BigNumber;
  recipient: PublicKey;
  reference: PublicKey;
  icon: string;
};

export function parseSolanaPayUrl(str: string): SolanaPropType | undefined {
  const regex = /(solana:\S+)/;
  try {
    const match = str.match(regex);
    if (!match || !match?.[0]) return;
    const url = new URL(match[0]);
    return {
      href: url.href,
      amount: new BigNumber(parseFloat(url.searchParams.get('amount') || '')),
      reference: new PublicKey(url.searchParams.get('reference') || ''),
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      recipient: new PublicKey(url.pathname),
    };
  } catch (e) {
    console.log('not solana pay');
  }
}

export function SolanaPayWidget({
  href,
  amount,
  reference,
  icon,
  recipient,
}: SolanaPropType) {
  const { program, wallet } = useApi();
  const connection = program!.provider.connection;

  const ref = useRef<HTMLElement & SVGSVGElement>(null);
  const options = createQROptions(href, undefined, 'transparent', 'white');

  const qr = useMemo(() => new QRCodeStyling(), []);
  useEffect(() => qr.update(options), [qr, options]);
  useEffect(() => {
    if (ref.current) {
      qr.append(ref.current as HTMLElement);
    }
  }, [ref, qr]);

  const [txReference, setTxReference] = useState<string | null>(null);

  const fetchReference = async (url: string, referenceString: string) => {
    const refff = await findReference(
      connection,
      new PublicKey(referenceString),
      { finality: 'confirmed' }
    );
    console.log({ refff });
    return refff;
  };

  const shouldFetch = !txReference && reference;

  const { data, error } = useSWR(
    shouldFetch ? ['solanapay', reference] : null,
    fetchReference,
    {
      onSuccess: (data) => {
        console.log('on success data', data);
        setTxReference(data.signature);
      },
    }
  );

  const handleTransfer = useCallback(async () => {
    if (!wallet || !wallet?.publicKey || !wallet?.sendTransaction) return;

    const transaction = await createTransfer(connection, wallet?.publicKey, {
      recipient: recipient,
      amount,
      // splToken,
      reference,
      // memo,
    });

    wallet?.sendTransaction(transaction, connection);
  }, []);

  return (
    <div className="dt-my-2 dt-flex flex-col dt-border dt-border-neutral-700 dt-rounded dt-p-1">
      <div className="dt-my-2 dt-flex dt-flex-row dt-space-x-2">
        <svg
          className="dt-shrink-0"
          width="40%"
          height="40%"
          viewBox="0 0 512 512"
          ref={ref}
        />
        <div className="dt-flex dt-flex-col dt-space-y-2">
          <p className="dt-text-xs dt-font-bold">
            Scan this code with your approved Solana wallet
          </p>
          <p className="dt-text-xs dt-text-neutral-500">
            You'll be asked to confirm the transaction
          </p>
          <div className="dt-flex dt-flex-row dt-space-x-1 dt-mr-2 dt-items-center">
            <p className="dt-text-xs dt-text-neutral-500">Powered by</p>
            <img className="dt-h-3 dt-w-3" src={icon} />
            <p className="dt-text-xs dt-text-white dt-font-bold">Pay</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleTransfer}
        className="dt-bg-neutral-700 dt-rounded-sm dt-py-2 dt-font-bold"
      >
        Send {amount.toNumber()} ◎
      </button>
    </div>
  );
}

export default function MessageContent(props: PropsType) {
  const solanaPay = useMemo(
    () => parseSolanaPayUrl(props.message.text),
    [props.message.text]
  );
  const text = props.message.text.replace(/(solana:\S+)/, '');

  return (
    <div className="dt-flex dt-flex-col">
      <LinkifiedText>{text}</LinkifiedText>
      {/* TODO: optimize rerender */}
      {solanaPay && <SolanaPayWidget {...solanaPay} />}
    </div>
  );
}
