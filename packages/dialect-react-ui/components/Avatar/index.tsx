import React from 'react';
import * as anchor from '@project-serum/anchor';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';

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
};

export default function Avatar({ publicKey, size = 'regular' }: PropTypes) {
  const { avatar } = useTheme();
  return (
    <div
      className={cs(
        avatar,
        `flex
        ${containerStyleMap[size]}`
      )}
    >
      <div className={`${textStyleMap[size]}`}>
        {publicKey.toString().substr(0, 1)}
      </div>
    </div>
  );
}
