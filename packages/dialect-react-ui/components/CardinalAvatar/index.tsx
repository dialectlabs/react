import type { PublicKey, Connection } from "@solana/web3.js";
import { useAddressImage } from '@cardinal/namespaces-components';
import { HiUserCircle } from "react-icons/hi";

export const CardinalAvatar = ({
  connection,
  address,
  style,
  height = "150px",
  width = "150px",
  dark = false,
  placeholder,
}: {
  connection: Connection;
  address: PublicKey | undefined;
  height?: string;
  width?: string;
  dark?: boolean;
  placeholder?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const { addressImage, loadingImage } = useAddressImage(connection, address);

  if (!address) return <></>;
  return loadingImage ? (
    <div
      style={{
        ...style,
        height,
        width,
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <>{placeholder}</>
    </div>
  ) : addressImage ? (
    <img
      style={{
        ...style,
        height: height,
        width: width,
        borderRadius: "50%",
      }}
      alt={`profile-${address.toString()}`}
      src={addressImage}
    ></img>
  ) : (
    <>{placeholder}</> || (
      <HiUserCircle style={{ width, height, color: "#FFF" }} />
    )
  );
};
