import { useIdentity } from '@dialectlabs/react-sdk';
import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';

import { Img } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';

const containerStyleMap = {
  regular: 'dt-w-14 dt-h-14',
  small: 'dt-w-11 dt-h-11',
  'extra-small': 'dt-w-10 dt-h-10',
};

const textStyleMap = {
  regular: 'dt-text-lg',
  small: 'dt-text-base',
  'extra-small': 'dt-text-base',
};

type PropTypes = {
  publicKey: PublicKey;
  size: 'regular' | 'small' | 'extra-small';
};

export default function Avatar({ publicKey, size = 'regular' }: PropTypes) {
  const { avatar } = useTheme();
  const placeholder = publicKey.toString().substr(0, 2);
  const { identity, loading } = useIdentity({ publicKey });

  return (
    <div
      className={clsx(
        avatar,
        `dt-flex
        ${containerStyleMap[size]}`
      )}
    >
      <div className={`${textStyleMap[size]}`}>
        {loading || !identity?.additionals?.avatarUrl ? (
          <div className="text-xs">{placeholder}</div>
        ) : (
          <Img
            className="dt-rounded-full"
            alt={`profile-${identity.name}`}
            src={identity.additionals.avatarUrl}
          />
        )}
      </div>
    </div>
  );
}
