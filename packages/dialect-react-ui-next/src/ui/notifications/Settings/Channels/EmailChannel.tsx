import { AddressType, useNotificationChannel } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useState } from 'react';
import { Button, Input } from '../../../core/primitives';
import { ClassTokens, Icons } from '../../../theme';
import { EmailInput } from './EmailInput';
import { useVerificationCode } from './model/useVerificationCode';

export const EmailChannel = () => {
  //TODO dapp context
  const dappAddress = '';
  const { globalAddress: emailAddress } = useNotificationChannel({
    addressType: AddressType.Email,
  });
  const isEmailSaved = Boolean(emailAddress);
  const isVerified = Boolean(emailAddress?.verified);

  const verificationNeeded = isEmailSaved && !isVerified;

  return (
    <div>
      {verificationNeeded ? (
        <VerificationCodeInput email={emailAddress?.value ?? ''} />
      ) : (
        <EmailInput dappAddress={dappAddress} />
      )}
    </div>
  );
};

const VERIFICATION_CODE_REGEX = new RegExp('^[0-9]{6}$');
const VerificationCodeInput = ({ email }: { email: string }) => {
  const {
    verificationCode,
    setVerificationCode,
    sendCode,
    resendCode,
    isSendingCode,
    isResendingCode,
    deleteAddress,
    currentError,
  } = useVerificationCode(AddressType.Email);

  const [isCodeValid, setCodeValid] = useState(false);
  const setCode = (code: string) => {
    if (VERIFICATION_CODE_REGEX.test(code)) {
      setCodeValid(true);
    } else {
      setCodeValid(false);
    }
    setVerificationCode(code);
  };

  return (
    <div>
      <Input
        id="settings-verification-code-email"
        placeholder="Enter verification code"
        label="Email"
        type="text"
        value={verificationCode}
        onChange={(e) => setCode(e.target.value)}
        rightAdornment={
          isSendingCode || isResendingCode ? (
            <div className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}>
              <Icons.Loader />
            </div>
          ) : (
            <Button onClick={sendCode} disabled={!isCodeValid}>
              Submit
            </Button>
          )
        }
      />
      <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
        <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
          Check your <span className={ClassTokens.Text.Primary}>{email} </span>
          Email for a verification code.
        </p>
        <div
          className={clsx(
            ClassTokens.Text.Brand,
            'dt-text-semibold dt-flex dt-flex-row dt-items-center dt-gap-8 dt-text-subtext',
          )}
        >
          <div
            className="dt-flex dt-cursor-pointer dt-flex-row dt-items-center dt-gap-1"
            onClick={deleteAddress}
          >
            <Icons.Xmark height={12} width={12} />
            Cancel
          </div>
          <div
            className="dt-flex dt-cursor-pointer dt-flex-row dt-items-center dt-gap-1"
            onClick={resendCode}
          >
            <Icons.Resend height={12} width={12} />
            Resend Code
          </div>
        </div>
      </div>
      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}
    </div>
  );
};
