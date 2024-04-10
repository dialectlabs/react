import {
  AddressType,
  useDapp,
  useDialectContext,
  useNotificationChannel,
} from '@dialectlabs/react-sdk';
import { TelegramHandleInput } from './TelegramHandleInput';
import { TelegramVerificationCodeInput } from './TelegramVerificationCodeInput';

export const TelegramChannel = () => {
  const { dappAddress } = useDialectContext();

  const { globalAddress: telegramAddress } = useNotificationChannel({
    addressType: AddressType.Telegram,
  });
  const isTelegramSaved = Boolean(telegramAddress);
  const isVerified = Boolean(telegramAddress?.verified);

  const { dapps } = useDapp({ verified: false });
  const dapp = dapps[dappAddress];

  const verificationNeeded = isTelegramSaved && !isVerified;
  return (
    <div>
      {verificationNeeded ? (
        <TelegramVerificationCodeInput
          dappTelegramName={dapp?.telegramUsername ?? ''}
        />
      ) : (
        <TelegramHandleInput dappAddress={dappAddress} />
      )}
    </div>
  );
};
