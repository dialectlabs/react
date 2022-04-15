import type { PublicKey, Connection } from '@solana/web3.js';
import { useAddressImage } from '@cardinal/namespaces-components';
import { HiUserCircle } from 'react-icons/hi';
import cs from '../../utils/classNames';

export const CardinalAvatar = ({
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
  const { addressImage, loadingImage } = useAddressImage(connection, address);

  if (!address) return <></>;
  return loadingImage ? (
    <div className={cs(className, 'dt-rounded-full', 'dt-overflow-hidden')}>
      <>{placeholder}</>
    </div>
  ) : addressImage ? (
    <img
      className="dt-rounded-full"
      alt={`profile-${address.toString()}`}
      src={addressImage}
    ></img>
  ) : (
    <>{placeholder}</> || <HiUserCircle className={className} />
  );
};
