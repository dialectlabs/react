import { useEffect, useMemo, useRef, useState } from "react";
import LinkifiedText from "./LinkifiedText";
// import type { Message } from '@dialectlabs/web3';
import QRCodeStyling from '@solana/qr-code-styling';
import { createQROptions, findReference } from '@solana/pay';
import useSWR from 'swr';
import { useApi } from "@dialectlabs/react";
import {PublicKey} from '@solana/web3.js'

type PropsType = {
  message: any;
}

export default function MessageContent(props: PropsType) {
  const { program } = useApi();
  const [txReference, setTxReference] = useState<string | null>(null);
  let solanaPayUrl: URL | undefined;
  try {
    solanaPayUrl = new URL(props.message.text.match(/(solana:\S+)/)[0]);
  } catch (e) {
    console.log('not solana pay'); 
  }

  const fetchReference = async (url: string, referenceString: string) => {
    const refff = await findReference(program!.provider.connection, new PublicKey(referenceString), { finality: 'confirmed' })
    console.log({refff});
    return refff;
  }

  const theref = solanaPayUrl?.searchParams.get('reference');
  // console.log({theref})

  const shouldFetch = !txReference && theref;

  const { data, error } = useSWR(
    shouldFetch ? ['solanapay', theref] : null,
    fetchReference,
    {
      onSuccess: (data) => {
        console.log("on success data", data);
        setTxReference(data.signature);
      }
    }
  );

  console.log('error', error);
  console.log('data', data);

  // @ts-ignore
  if (solanaPayUrl) {
    console.log(solanaPayUrl);
    console.log('amount', solanaPayUrl.searchParams.get('amount'));
    console.log('recipient', solanaPayUrl.pathname);
    console.log('reference', solanaPayUrl.searchParams.get('reference'));
    // extract rest of the text
    const text = props.message.text.replace(/(solana:\S+)/, '');
    console.log('text', text);
    const ref = useRef<SVGElement>(null);
    const size = 480;
    const options = createQROptions(solanaPayUrl.href, undefined, 'transparent', 'white');

    const qr = useMemo(() => new QRCodeStyling(), []);
    useEffect(() => qr.update(options), [qr, options]);
    useEffect(() => {
        if (ref.current) {
            qr.append(ref.current);
        }
    }, [ref, qr]);

    return (
      <div className="dt-flex dt-flex-col">
        <LinkifiedText>{`btw when you get a chance can you pay me back for those almonds... ;)`}</LinkifiedText>
        <div className='dt-my-2 dt-flex flex-col dt-border dt-border-neutral-700 dt-rounded dt-p-1'>
          <div className='dt-my-2 dt-flex dt-flex-row dt-space-x-2'>
            <svg
              className='dt-shrink-0'
              width='40%'
              height='40%'
              viewBox="0 0 512 512"
              ref={ref} />
            <div className='dt-flex dt-flex-col dt-space-y-2'>
              <p className='dt-text-xs dt-font-bold'>Scan this code with your approved Solana wallet</p>
              <p className='dt-text-xs dt-text-neutral-500'>You'll be asked to confirm the transaction</p>
              <div className='dt-flex dt-flex-row dt-space-x-1 dt-mr-2 dt-items-center'>
                <p className='dt-text-xs dt-text-neutral-500'>Powered by</p>
                <img className='dt-h-3 dt-w-3' src='https://cryptologos.cc/logos/solana-sol-logo.png' />
                <p className='dt-text-xs dt-text-white dt-font-bold'>Pay</p>
              </div>
            </div>          
          </div>
          <button
            onClick={() => console.log('clicked')}
            className='dt-bg-neutral-700 dt-rounded-sm dt-py-2 dt-font-bold'
          >
            Send {solanaPayUrl.searchParams.get('amount')} ◎
          </button>
        </div>
      </div>
    );
  };
  return (<LinkifiedText>{props.message.text}</LinkifiedText>)
}
