import React from 'react';
import * as anchor from '@project-serum/anchor';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { AddressImage, DisplayAddress } from '@cardinal/namespaces-components';
import { useApi } from '@dialectlabs/react/components/ApiContext';

const containerStyleMap = {
  regular: 'dt-w-14 dt-h-14',
  small: 'dt-w-11 dt-h-11',
};

const textStyleMap = {
  regular: 'dt-text-lg',
  small: 'dt-text-base',
};

type PropTypes = {
  publicKey: anchor.web3.PublicKey;
  size: 'regular' | 'small';
};

export default function Avatar({ publicKey, size = 'regular' }: PropTypes) {
  const { program } = useApi();
  const { avatar } = useTheme();
  return (
    <div
      className={cs(
        avatar,
        `dt-flex
        ${containerStyleMap[size]}`
      )}
    >
      <div className={`${textStyleMap[size]}`}>
        {program?.provider.connection ? (
          <AddressImage
            height="100%"
            connection={program?.provider.connection}
            address={publicKey}
            placeholder={publicKey.toString().substr(0, 1)}
          />
        ) : (
          publicKey.toString().substr(0, 1)
        )}
      </div>
    </div>
  );
}
