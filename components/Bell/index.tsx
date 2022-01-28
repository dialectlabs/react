import React, { useEffect, useRef, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { BellIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import NotificationCenter from '../NotificationCenter';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
} from '../../api/ApiContext';
import { Transition } from '@headlessui/react';
import { DialectProvider } from '../../api/DialectContext';

type PropTypes = {
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  publicKey: anchor.web3.PublicKey;
};

function useOutsideAlerter(
  ref: React.MutableRefObject<null>,
  bellRef: React.MutableRefObject<null>,
  setOpen: CallableFunction
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        console.log('You clicked outside of me!');
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function WrappedBell(props: PropTypes): JSX.Element {
  const wrapperRef = useRef(null);
  const bellRef = useRef(null);
  const [open, setOpen] = useState(false);
  useOutsideAlerter(wrapperRef, bellRef, setOpen);
  const { setWallet, setNetwork, setRpcUrl } = useApi();

  useEffect(
    () => setWallet(connected(props.wallet) ? props.wallet : null),
    [connected(props.wallet)]
  );
  useEffect(() => setNetwork(props.network || null), [props.network]);
  useEffect(() => setRpcUrl(props.rpcUrl || null), [props.rpcUrl]);

  return (
    <>
      <Head>
        {/* TODO: replace with importing the fonts right isolated way  */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col items-end">
        <button
          ref={bellRef}
          className="flex items-center justify-center rounded-full w-12 h-12 focus:outline-none bg-white border border-gray-200 shadow-md"
          onClick={() => setOpen(!open)}
        >
          <BellIcon className="w-6 h-6 rounded-full text-gray-500" />
        </button>
        <Transition
          className="z-50 absolute top-16 w-96 h-96"
          style={{ width: '29rem', height: '29rem' }}
          show={open}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={wrapperRef}
            className="w-full h-full bg-white"
            // TODO: investigate blur
            // className="w-full h-full bg-white/10"
            // style={{ backdropFilter: 'blur(132px)' }}
          >
            <NotificationCenter />
          </div>
        </Transition>
      </div>
    </>
  );
}

export function Bell(props: PropTypes): JSX.Element {
  return (
    <ApiProvider>
      <DialectProvider publicKey={props.publicKey}>
        <WrappedBell {...props} />
      </DialectProvider>
    </ApiProvider>
  );
}
