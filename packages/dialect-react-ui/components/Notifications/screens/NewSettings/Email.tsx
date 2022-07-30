import { Toggle } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import { useCallback, useEffect, useState } from 'react';
import { P } from '../../../common/preflighted';
import { VerificationInput } from './VerificationInput';
import { RightAdornment } from './RightAdorment';
import OutlinedInput from '../../../common/primitives/OutlinedInput';
import CancelIcon from '../../../Icon/Cancel';

const addressType = AddressType.Email;

const Email = () => {
  const { textStyles } = useTheme();

  const {
    addresses: { [addressType]: emailAddress },
    create: createAddress,
    delete: deleteAddress,
    update: updateAddress,

    toggle: toggleAddress,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSendingCode,
    isVerifyingCode,

    errorFetching: errorFetchingAddresses,
  } = useAddresses();

  const [email, setEmail] = useState(emailAddress?.value ?? '');
  const [isEnabled, setIsEnabled] = useState(Boolean(emailAddress?.enabled));
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const isEmailSaved = Boolean(emailAddress);
  const isVerified = emailAddress?.verified;

  const isLoading =
    isCreatingAddress ||
    isDeletingAddress ||
    isUpdatingAddress ||
    isVerifyingCode ||
    isSendingCode;

  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    setEmail(emailAddress?.value || '');
  }, [isEmailSaved, emailAddress?.enabled, emailAddress?.value]);

  const updateEmail = useCallback(async () => {
    if (error) {
      return;
    }
    try {
      await updateAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  }, [email]);

  const saveEmail = useCallback(async () => {
    if (error) {
      return;
    }
    try {
      await createAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  }, [email]);

  const deleteEmail = async () => {
    try {
      await deleteAddress({ addressType });
      setIsDeleting(false);
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const toggleEmail = async (nextValue: boolean) => {
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

  const onChange = (e: any) => {
    setEmail(e.target.value);
  };

  const isEditing = emailAddress?.value !== email && isEmailSaved;

  return (
    <div>
      <label
        htmlFor="settings-email"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Email
      </label>

      {isEmailSaved && !isVerified ? (
        <VerificationInput
          description="Сheck your email for a verification code."
          onCancel={deleteEmail}
          addressType={addressType}
        />
      ) : (
        <OutlinedInput
          id="settings-email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={onChange}
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
            <RightAdornment
              loading={isLoading}
              currentVal={email}
              isSaved={isEmailSaved}
              isChanging={isEditing}
              isVerified={isVerified}
              onSaveCallback={saveEmail}
              onDeleteCallback={deleteEmail}
              onUpdateCallback={updateEmail}
              deleteConfirm={(isDelete) => {
                setIsDeleting(isDelete);
              }}
              isDeleting={isDeleting}
            />
          }
        />
      )}

      {(isDeleting || isEditing) && (
        <div
          className={clsx(
            textStyles.small,
            'display: inline-flex',
            'dt-mb-1 dt-mt-1'
          )}
        >
          {isDeleting && (
            <div>
              <span className="dt-opacity-60">
                Deleting your email here will delete it for all dapps you're
                subscribed to.
              </span>
              <span
                onClick={() => setIsDeleting(false)}
                className="dt-inline-block dt-cursor-pointer"
              >
                <CancelIcon
                  className={clsx('dt-inline-block dt-mr-0.5 dt-mb-0.5')}
                  height={14}
                  width={14}
                />
                Cancel
              </span>
            </div>
          )}
          {isEditing && (
            <div>
              <span className="dt-opacity-60">
                Updating your email here will update it across all dapps you've
                subscribed to.
              </span>
              <span
                onClick={() => {
                  setEmail(emailAddress?.value);
                }}
                className="dt-inline-block dt-cursor-pointer"
              >
                <CancelIcon
                  className={clsx('dt-inline-block dt-mr-0.5 dt-mb-0.5')}
                  height={14}
                  width={14}
                />
                Cancel
              </span>
            </div>
          )}
        </div>
      )}

      {currentError && (
        <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </P>
      )}

      {isEmailSaved && isVerified && !isEditing && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            toggleSize={'S'}
            checked={isEnabled}
            onClick={async () => {
              const nextValue = !isEnabled;
              await toggleEmail?.(nextValue);
              setIsEnabled(nextValue);
            }}
          />

          <P className={clsx(textStyles.small, 'dt-opacity-60')}>
            Notifications {isEnabled ? 'on' : 'off'}
          </P>
        </div>
      )}
    </div>
  );
};

export default Email;
