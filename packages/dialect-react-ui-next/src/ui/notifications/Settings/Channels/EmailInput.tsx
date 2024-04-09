import {
  AddressType,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { Button, ButtonType, Input } from '../../../core';
import { ClassTokens, Icons } from '../../../theme';
import { ChannelNotificationsToggle } from './ChannelNotificationsToggle';

const EMAIL_REGEX = new RegExp('^\\S+@\\S+\\.\\S+$');

export const EmailInput = ({ dappAddress }: { dappAddress: string }) => {
  const {
    globalAddress: emailAddress,
    create: createAddress,
    delete: deleteAddress,
    update: updateAddress,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSendingCode,
    isVerifyingCode,

    errorFetching: errorFetchingAddresses,
  } = useNotificationChannel({ addressType: AddressType.Email });

  const {
    enabled: subscriptionEnabled,
    toggleSubscription,
    isToggling,
  } = useNotificationChannelDappSubscription({
    addressType: AddressType.Email,
    dappAddress,
  });

  const [email, setEmail] = useState(emailAddress?.value || '');

  const [isEmailValid, setEmailValid] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const setEmailValue = (email: string) => {
    if (EMAIL_REGEX.test(email) || !email) {
      setEmailValid(true);
      setValidationError(false);
    } else {
      setEmailValid(false);
    }
    setEmail(email);
  };

  const [error, setError] = useState<Error | null>(null);
  const [isUserDeleting, setIsUserDeleting] = useState(false);

  const isEmailSaved = Boolean(emailAddress);
  const isVerified = Boolean(emailAddress?.verified);
  const isLoading =
    isCreatingAddress ||
    isUpdatingAddress ||
    isDeletingAddress ||
    isSendingCode ||
    isVerifyingCode ||
    isToggling;

  const currentError = error || errorFetchingAddresses;

  const updateEmail = useCallback(async () => {
    if (!isEmailValid) setValidationError(true);
    else {
      try {
        await updateAddress({ value: email });
        setError(null);
      } catch (e) {
        setError(e as Error);
      }
    }
  }, [email, isEmailValid, updateAddress]);

  const saveEmail = useCallback(async () => {
    if (!isEmailValid) setValidationError(true);
    else {
      try {
        const address = await createAddress({ value: email });
        await toggleSubscription({ enabled: true, address });
        setError(null);
      } catch (e) {
        setError(e as Error);
      }
    }
  }, [createAddress, email, isEmailValid, toggleSubscription]);

  const deleteEmail = async () => {
    try {
      await deleteAddress();
      setIsUserDeleting(false);
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const toggleEmail = async (nextValue: boolean) => {
    try {
      await toggleSubscription({
        enabled: nextValue,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const isUserEditing = emailAddress?.value !== email && isEmailSaved;

  const getButton = () => {
    if (!email) return null;
    if (isLoading) {
      return (
        <div className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}>
          <Icons.Loader />
        </div>
      );
    }
    if (isUserDeleting) {
      return (
        <Button onClick={deleteEmail} type={ButtonType.Destructive}>
          Delete
        </Button>
      );
    }
    if (isUserEditing) {
      return (
        <Button onClick={updateEmail} disabled={!isEmailValid || !email}>
          Submit
        </Button>
      );
    }
    if (isVerified) {
      return (
        <div
          className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}
          onClick={() => setIsUserDeleting(true)}
        >
          <Icons.Trash />
        </div>
      );
    }

    return (
      <Button onClick={saveEmail} disabled={!isEmailValid || !email}>
        Submit
      </Button>
    );
  };

  return (
    <div>
      <Input
        label="Email"
        placeholder="Enter you Email"
        id="settings-email"
        value={email}
        onChange={(e) => {
          setEmailValue(e.target.value);
        }}
        onBlur={() => {
          if (email && !isEmailValid) setValidationError(true);
        }}
        rightAdornment={getButton()}
      />

      {isEmailSaved && isVerified && !isUserEditing && !isUserDeleting && (
        <div className="dt-mt-2">
          <ChannelNotificationsToggle
            enabled={subscriptionEnabled}
            onChange={toggleEmail}
          />
        </div>
      )}

      {validationError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          Please enter a valid Email.
        </p>
      )}

      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}

      {isUserDeleting && (
        <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
          <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
            Deleting your email here will delete it across all dapps you’ve
            signed up.
          </p>
          <div
            onClick={() => setIsUserDeleting(false)}
            className={clsx(
              ClassTokens.Text.Brand,
              'dt-text-semibold dt-flex dt-cursor-pointer dt-flex-row dt-items-center dt-gap-1 dt-text-subtext',
            )}
          >
            <Icons.Xmark height={12} width={12} />
            Cancel
          </div>
        </div>
      )}

      {isUserEditing && (
        <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
          <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
            Updating your email here will update it across all dapps you’ve
            signed up.
          </p>
          <div
            onClick={() => {
              setEmail(emailAddress?.value || '');
            }}
            className={clsx(
              ClassTokens.Text.Brand,
              'dt-text-semibold dt-flex dt-cursor-pointer dt-flex-row dt-items-center dt-gap-1 dt-text-subtext',
            )}
          >
            <Icons.Xmark height={12} width={12} />
            Cancel
          </div>
        </div>
      )}
    </div>
  );
};
