import { IconButton, OutlinedInput } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import { useEffect, useState } from 'react';
import { P } from '../../../common/preflighted';

const addressType = AddressType.Email;

const Email = () => {
  const { textStyles, icons } = useTheme();

  const {
    addresses: { [addressType]: emailAddress },
    create: createAddress,
    delete: deleteAddress,
    update: updateAddress,
    verify: verifyCode,
    resend: resendCode,

    toggle: toggleAddress,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSendingCode,
    isVerifyingCode,

    errorFetching: errorFetchingAddresses,
  } = useAddresses();

  const [email, setEmail] = useState(emailAddress?.value ?? '');
  const [isEmailEditing, setEmailEditing] = useState(!emailAddress?.enabled);
  const [verificationCode, setVerificationCode] = useState('');

  const [error, setError] = useState<Error | null>(null);

  const isEmailSaved = Boolean(emailAddress);
  const isChanging = emailAddress && isEmailEditing;
  const isVerified = emailAddress?.verified;

  const currentError = error || errorFetchingAddresses;

  // // FIXME: replace with key change
  useEffect(() => {
    // Update state if addresses updated
    setEmailEditing(!isEmailSaved && !emailAddress?.enabled);
    setEmail(emailAddress?.value || '');
  }, [isEmailSaved, emailAddress?.enabled, emailAddress?.value]);

  const updateEmail = async () => {
    // TODO: validate & save email
    if (error) {
      return;
    }
    try {
      await updateAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
    setEmailEditing(false);
  };

  const saveEmail = async () => {
    if (error) {
      return;
    }
    try {
      await createAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteEmail = async () => {
    try {
      await deleteAddress({ addressType });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const resendEmailCode = async () => {
    try {
      await resendCode({ addressType });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const sendCode = async () => {
    try {
      await verifyCode({ addressType, code: verificationCode });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setVerificationCode('');
    }
  };

  const toggleEmail = async (nextValue: boolean) => {
    if (!emailAddress || emailAddress?.enabled === nextValue) {
      return;
    }
    try {
      await toggleAddress({
        addressType,
        enabled: nextValue,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <div>
      <label
        htmlFor="settings-email"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Email
      </label>
      <OutlinedInput
        id="settings-email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={(e) =>
          e.target.checkValidity()
            ? setError(null)
            : setError({
                name: 'incorrectEmail',
                message: 'Please enter a valid email',
              })
        }
        onInvalid={(e) => {
          e.preventDefault();
          setError({
            name: 'incorrectEmail',
            message: 'Please enter a valid email',
          });
        }}
        pattern="^\S+@\S+\.\S+$"
        rightAdornment={
          email && (
            <IconButton
              className="dt-bg-[#303030] dt-rounded-full dt-w-9 dt-h-9 dt-flex dt-items-center dt-justify-center"
              icon={<icons.checkmarkThin />}
              onClick={saveEmail}
            />
          )
        }
      />
      {currentError && (
        <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </P>
      )}
    </div>
  );
};

export default Email;
