import React, { useEffect, useRef, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { BellIcon } from '@heroicons/react/outline';
// TODO: remove this import, fonts need to be added by the parent
import Head from 'next/head';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
  DialectProvider,
} from '@dialectlabs/react';
import { Transition } from '@headlessui/react';
import cs from '../../utils/classNames';
import { BG_COLOR_MAPPING, TEXT_COLOR_MAPPING, ThemeType } from '../common';
import NotificationCenter from '../NotificationCenter';

type PropTypes = {
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  publicKey: anchor.web3.PublicKey;
  theme?: ThemeType;
  bellClassName?: string;
  bellStyle?: object;
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
  const isWalletConnected = connected(props.wallet);

  useEffect(
    () => setWallet(connected(props.wallet) ? props.wallet : null),
    [props.wallet, isWalletConnected, setWallet]
  );
  useEffect(
    () => setNetwork(props.network || null),
    [props.network, setNetwork]
  );
  useEffect(() => setRpcUrl(props.rpcUrl || null), [props.rpcUrl, setRpcUrl]);

  const bgColor = props.theme && BG_COLOR_MAPPING[props.theme];
  const textColor = props.theme && TEXT_COLOR_MAPPING[props.theme];

  return (
    <>
      <Head>
        {/* TODO: replace with importing the fonts right isolated way  */}
        {/* TODO: remove next/head from this module completely and place it under "Prerequisites" for this package */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={cs('flex flex-col items-end relative', textColor)}>
        <button
          ref={bellRef}
          className={cs(
            'flex items-center justify-center rounded-full w-12 h-12 focus:outline-none border border-gray-200 shadow-md',
            bgColor
          )}
          style={props?.bellStyle}
          onClick={() => setOpen(!open)}
        >
          <BellIcon className={cs('w-6 h-6 rounded-full')} />
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
            className="w-full h-full"
            // TODO: investigate blur
            // className="w-full h-full bg-white/10"
            // style={{ backdropFilter: 'blur(132px)' }}
          >
            <NotificationCenter theme={props.theme} />
          </div>
        </Transition>
      </div>
    </>
  );
}

export default function Bell(props: PropTypes): JSX.Element {
  return (
    <ApiProvider>
      <DialectProvider publicKey={props.publicKey}>
        <WrappedBell {...props} />
      </DialectProvider>
    </ApiProvider>
  );
}
