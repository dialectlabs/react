import { useDialectSdk } from '@dialectlabs/react-sdk';
import type { Connection, PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { HiUserCircle } from 'react-icons/hi';
import useSWR from 'swr';
import useAddressImage from '../../hooks/useAddressImage';
import { fetchSolanaNameServiceName } from '../common';
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
  const { src: addressImage, isLoading } = useAddressImage(connection, address);

  if (!address) return <></>;

  return isLoading ? (
    <div className={clsx(className, 'dt-rounded-full', 'dt-overflow-hidden')}>
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
  const {
    info: {
      solana: { dialectProgram },
    },
  } = useDialectSdk();

  const connection = dialectProgram.provider.connection;
  const { data } = useSWR(
    [connection, publicKey.toBase58(), 'sns'],
    fetchSolanaNameServiceName
  );

  return (
    <div
      className={clsx(
        avatar,
        `dt-flex
        ${containerStyleMap[size]}`
      )}
    >
      <div className={`${textStyleMap[size]}`}>
        {connection ? (
          <CardinalAvatar
            className="dt-h-full"
            connection={connection}
            address={publicKey}
            // TODO: refactor the CardinalAvatar to separate out SNS logic
            placeholder={
              data?.solanaDomain
                ? data.solanaDomain.substr(0, 1)
                : publicKey.toString().substr(0, 1)
            }
          />
        ) : (
          publicKey.toString().substr(0, 1)
        )}
      </div>
    </div>
  );
}
