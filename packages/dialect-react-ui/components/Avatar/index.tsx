import React from 'react';
import * as anchor from '@project-serum/anchor';

const containerStyleMap = {
  regular: 'w-14 h-14',
  small: 'w-11 h-11',
};

const textStyleMap = {
  regular: 'text-lg',
  small: 'text-base',
};

type PropTypes = {
  publicKey: anchor.web3.PublicKey;
  size: 'regular' | 'small';
}

export default function Avatar({publicKey, size = 'regular'}: PropTypes) {
  return (
    <div
      className={`flex rounded-full items-center justify-center bg-neutral-900
        ${containerStyleMap[size]}`}>
      <div className={`text-neutral-400 ${textStyleMap[size]}`}>
        {publicKey.toString().substr(0, 1)}
      </div>
    </div>
  );
}
