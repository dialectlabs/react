import { AddressType, useNotificationChannel } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { Button } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';
import CancelIcon from '../../../Icon/Cancel';
import OutlinedInput from '../../../common/primitives/OutlinedInput';

interface IVerificationInputProps {
  description?: string;
  addressType: AddressType;
  onCancel: () => void;
  customText?: ReactNode;
}

const VERIFICATION_CODE_REGEX = '^[0-9]{6}$';

export const VerificationInput = ({
  addressType,
  onCancel,
  description,
  customText,
}: IVerificationInputProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const { verify: verifyCode, resend } = useNotificationChannel({
    addressType,
  });
  const { textStyles, adornmentButton } = useTheme();

  const sendCode = async () => {
    try {
      await verifyCode({ code: verificationCode });
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    } finally {
      setVerificationCode('');
    }
  };

  const resendCode = async () => {
    try {
      await resend();
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    }
  };

  return (
    <>
      <OutlinedInput
        id="settings-verification-cide"
        placeholder="Enter verification code"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        onBlur={(e) =>
          e.target.checkValidity()
            ? setCurrentError(null)
            : setCurrentError({
                name: 'incorrectEmail',
                message: 'Please enter a valid email',
              })
        }
        onInvalid={(e) => {
          e.preventDefault();
          setCurrentError({
            name: 'incorrectEmail',
            message: 'Please enter a valid email',
          });
        }}
        pattern={VERIFICATION_CODE_REGEX}
        rightAdornment={
          <Button
            onClick={sendCode}
            className={clsx(adornmentButton, 'dt-w-16 dt-h-9')}
          >
            Submit
          </Button>
        }
      />
      <div
        className={clsx(
          textStyles.small,
          'display: inline-flex',
          'dt-mb-1 dt-mt-1'
        )}
      >
        {customText ? (
          customText
        ) : (
          <>
            <span className="dt-opacity-50">{description}</span>
            <span
              onClick={onCancel}
              className="dt-inline-block dt-cursor-pointer"
            >
              <CancelIcon
                className={clsx('dt-inline-block dt-mr-0.5 dt-mb-0.5')}
                height={14}
                width={14}
              />
              Cancel
            </span>
            <span
              onClick={resendCode}
              className="dt-inline-block dt-cursor-pointer"
            >
              <ResendIcon
                className={clsx('dt-inline-block dt-ml-1 dt-mr-0.5 dt-mb-0.5')}
                height={14}
                width={14}
              />
              Resend code
            </span>
          </>
        )}
      </div>
      {currentError && (
        <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </P>
      )}
    </>
  );
};
