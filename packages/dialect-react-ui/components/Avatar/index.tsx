import cs from '../../utils/classNames';
import type { PublicKey } from '@project-serum/anchor';
import { useTheme } from '../common/ThemeProvider';
import { useApi } from '@dialectlabs/react';
import type { Connection } from '@solana/web3.js';
import { tryGetImageUrl } from '@cardinal/namespaces-components';
import { getReverseEntry, breakName, formatName } from '@cardinal/namespaces';
import { HiUserCircle } from 'react-icons/hi';
import { Img } from '../common/preflighted';
import useSWR from 'swr';

const containerStyleMap = {
  regular: 'dt-w-14 dt-h-14',
  small: 'dt-w-11 dt-h-11',
};

const textStyleMap = {
  regular: 'dt-text-lg',
  small: 'dt-text-base',
};

type PropTypes = {
  publicKey: PublicKey;
  size: 'regular' | 'small';
};

const CardinalAvatar = ({
  connection,
  address,
  placeholder,
  className,
}: {
  connection: Connection;
  address: PublicKey | undefined;
  placeholder?: React.ReactNode;
  className?: string;
}) => {
  const reverseEntry = useSWR([connection, address], getReverseEntry);
  const displayName = formatName(
    reverseEntry.data?.parsed.namespaces,
    reverseEntry.data?.parsed.entryName
  );
  const [_namespace, handle] = displayName ? breakName(displayName) : [];
  const addressImage = useSWR(handle, tryGetImageUrl);
  const addressImageUrl = addressImage.data;

  if (!address) return <></>;
  return !addressImage.data ? (
    <div className={cs(className, 'dt-rounded-full', 'dt-overflow-hidden')}>
      <>{placeholder}</>
    </div>
  ) : addressImage ? (
    <Img
      className="dt-rounded-full"
      alt={`profile-${address.toString()}`}
      src={addressImageUrl}
    />
  ) : (
    <>{placeholder}</> || <HiUserCircle className={className} />
  );
};

export default function Avatar({ publicKey, size = 'regular' }: PropTypes) {
  const { avatar } = useTheme();
  const { program } = useApi();

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
          <CardinalAvatar
            className="dt-h-full"
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
