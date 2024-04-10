import {
  AddressType,
  useDialectContext,
  useNotificationChannel,
} from '@dialectlabs/react-sdk';
import { EmailInput } from './EmailInput';
import { EmailVerificationCodeInput } from './EmailVerificationCodeInput';

export const EmailChannel = () => {
  const { dappAddress } = useDialectContext();
  const { globalAddress: emailAddress } = useNotificationChannel({
    addressType: AddressType.Email,
  });
  const isEmailSaved = Boolean(emailAddress);
  const isVerified = Boolean(emailAddress?.verified);

  const verificationNeeded = isEmailSaved && !isVerified;

  return (
    <div>
      {verificationNeeded ? (
        <EmailVerificationCodeInput email={emailAddress?.value ?? ''} />
      ) : (
        <EmailInput dappAddress={dappAddress} />
      )}
    </div>
  );
};
