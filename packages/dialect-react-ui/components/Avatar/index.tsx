import { tryGetImageUrl } from '@cardinal/namespaces-components';
import { breakName } from '@cardinal/namespaces';
import { HiUserCircle } from 'react-icons/hi';
import { useApi } from '@dialectlabs/react';
import type { Connection, PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { Img } from '../common/preflighted';
import { fetchTwitterHandleFromAddress } from '../DisplayAddress';

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

export const fetchImageUrlFromAddress = async (
  connection: Connection,
  publicKeyString: string
) => {
  try {
    const displayName = await fetchTwitterHandleFromAddress(
      connection,
      publicKeyString
    );
    const [_namespace, handle] = displayName ? breakName(displayName) : [];
    if (!handle) return;
    return await tryGetImageUrl(handle);
  } catch (e) {
    return;
  }
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
  const { data: addressImage, error } = useSWR(
    address ? [connection, address.toString(), 'avatar'] : null,
    fetchImageUrlFromAddress
  );

  const isLoading = typeof addressImage === 'undefined' && !error;

  if (!address) return <></>;

  return isLoading ? (
    <div className={cs(className, 'dt-rounded-full', 'dt-overflow-hidden')}>
      <>{placeholder}</>
    </div>
  ) : addressImage ? (
    <Img
      className="dt-rounded-full"
      alt={`profile-${address.toString()}`}
      src={addressImage}
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
