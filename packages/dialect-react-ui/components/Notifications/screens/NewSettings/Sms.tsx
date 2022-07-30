import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import { RightAdornment } from './RightAdorment';
import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import { useEffect, useState } from 'react';
import { P } from '../../../common/preflighted';
import { VerificationInput } from './VerificationInput';
import OutlinedInput from '../../../common/primitives/OutlinedInput';
import { Toggle } from '../../../common';
import CancelIcon from '../../../Icon/Cancel';

const addressType = AddressType.PhoneNumber;

const Sms = () => {
  const {
    addresses: { [addressType]: smsAddress },
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

  const { textStyles } = useTheme();

  const [smsNumber, setSmsNumber] = useState(smsAddress?.value);
  const [error, setError] = useState<Error | null>(null);
  const [isEnabled, setIsEnabled] = useState(Boolean(smsAddress?.enabled));
  const [isDeleting, setIsDeleting] = useState(false);

  const isSmsNumberSaved = Boolean(smsAddress);
  const isVerified = smsAddress?.verified;

  const isLoading =
    isCreatingAddress ||
    isUpdatingAddress ||
    isDeletingAddress ||
    isSendingCode ||
    isVerifyingCode;

  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    setSmsNumber(smsAddress?.value || '');
  }, [isSmsNumberSaved, smsAddress?.enabled, smsAddress?.value]);

  const updateSmsNumber = async () => {
    if (error) return;

    try {
      await updateAddress({ addressType, value: smsNumber });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
    }
  };

  const saveSmsNumber = async () => {
    if (error) return;

    try {
      await createAddress({ addressType, value: smsNumber });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteSmsNumber = async () => {
    try {
      await deleteAddress({ addressType });
      setError(null);
      setIsDeleting(false);
    } catch (e) {
      setError(e as Error);
    }
  };

  const toggleSms = async (nextValue: boolean) => {
    if (!smsAddress || smsAddress?.enabled === nextValue) {
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

  const onChange = (e: any) => {
    setSmsNumber(e.target.value);
  };

  const isEditing = smsNumber !== smsAddress?.value && isSmsNumberSaved;

  return (
    <div>
      <label
        htmlFor="settings-sms"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Phone
      </label>
      {isSmsNumberSaved && !isVerified ? (
        <VerificationInput
          onCancel={deleteSmsNumber}
          addressType={addressType}
          description="Сheck sms for verification code."
        />
      ) : (
        <OutlinedInput
          id="settings-sms"
          placeholder="+15554443333 (+1 required, US only)"
          type="tel"
          value={smsNumber}
          rightAdornment={
            <RightAdornment
              loading={isLoading}
              currentVal={smsNumber}
              isSaved={isSmsNumberSaved}
              isChanging={isEditing}
              isVerified={isVerified}
              onSaveCallback={saveSmsNumber}
              onDeleteCallback={deleteSmsNumber}
              onUpdateCallback={updateSmsNumber}
              deleteConfirm={(isDelete) => {
                setIsDeleting(isDelete);
              }}
              isDeleting={isDeleting}
            />
          }
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
                Deleting your email here will delete it across all dapps you've
                signed up.
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
                signed up.
              </span>
              <span
                onClick={() => {
                  setSmsNumber(smsAddress?.value);
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

      {isSmsNumberSaved && isVerified && !isEditing && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            toggleSize={'S'}
            checked={isEnabled}
            onClick={async () => {
              const nextValue = !isEnabled;
              await toggleSms?.(nextValue);
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

export default Sms;
