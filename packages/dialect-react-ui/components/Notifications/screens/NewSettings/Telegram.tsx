import { Toggle } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import {
  AddressType,
  useAddresses,
  useDialectSdk,
} from '@dialectlabs/react-sdk';
import { useEffect, useState } from 'react';
import { RightAdornment } from './RightAdorment';
import { VerificationInput } from './VerificationInput';
import { P } from '../../../common/preflighted';
import OutlinedInput from '../../../common/primitives/OutlinedInput';
import CancelIcon from '../../../Icon/Cancel';

const addressType = AddressType.Telegram;
const Telegram = () => {
  const {
    info: {
      config: { environment },
    },
  } = useDialectSdk();
  const {
    addresses: { [addressType]: telegramAddress },
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

  const [telegramUsername, setTelegramUsername] = useState(
    telegramAddress?.value
  );
  const [error, setError] = useState<Error | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isTelegramSaved = Boolean(telegramAddress);
  const isVerified = telegramAddress?.verified;
  const isLoading =
    isCreatingAddress ||
    isUpdatingAddress ||
    isDeletingAddress ||
    isSendingCode ||
    isVerifyingCode;

  const [isEnabled, setIsEnabled] = useState(Boolean(telegramAddress?.enabled));
  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    setTelegramUsername(telegramAddress?.value || '');
  }, [isTelegramSaved, telegramAddress?.enabled, telegramAddress?.value]);

  const updateTelegram = async () => {
    if (error) return;

    try {
      await updateAddress({
        addressType,
        value: telegramUsername,
      });
      setError(null);
      setIsDeleting(false);
    } catch (e) {
      setError(e as Error);
    } finally {
    }
  };

  const saveTelegram = async () => {
    if (error) return;

    try {
      const value = telegramUsername?.replace('@', '');
      await createAddress({ addressType, value });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteTelegram = async () => {
    try {
      await deleteAddress({ addressType });
      setIsDeleting(false);
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const onChange = (e: any) => {
    setTelegramUsername(e.target.value);
  };

  const toggleTelegram = async (nextValue: boolean) => {
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

  const botURL =
    environment === 'production'
      ? 'https://telegram.me/DialectLabsBot'
      : 'https://telegram.me/DialectLabsDevBot';

  const isEditing =
    telegramAddress?.value !== telegramUsername && isTelegramSaved;

  return (
    <div>
      <label
        htmlFor="settings-telegram"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Telegram
      </label>

      {isTelegramSaved && !isVerified ? (
        <VerificationInput
          onCancel={deleteTelegram}
          addressType={addressType}
          customText={
            <>
              <a
                className={clsx(textStyles.small)}
                href={botURL}
                target="_blank"
                rel="noreferrer"
              >
                🤖
                <span className="dt-opacity-50">
                  {' '}
                  Get verification code by starting{' '}
                </span>
                <span className="dt-underline">this bot </span>
                <span className="dt-opacity-50">with command: /start</span>
              </a>
              <span
                onClick={deleteTelegram}
                className="dt-inline-block dt-cursor-pointer"
              >
                <CancelIcon
                  className={clsx('dt-inline-block dt-mr-0.5 dt-mb-0.5')}
                  height={14}
                  width={14}
                />
                Cancel
              </span>
            </>
          }
        />
      ) : (
        <OutlinedInput
          id="settings-telegram"
          placeholder="@"
          value={telegramUsername}
          onChange={onChange}
          rightAdornment={
            <RightAdornment
              loading={isLoading}
              currentVal={telegramUsername}
              isSaved={isTelegramSaved}
              isChanging={isEditing}
              isVerified={isVerified}
              onSaveCallback={saveTelegram}
              onDeleteCallback={deleteTelegram}
              onUpdateCallback={updateTelegram}
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
                  setTelegramUsername(telegramAddress?.value);
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

      {isTelegramSaved && isVerified && !isEditing && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            checked={isEnabled}
            toggleSize="S"
            onClick={async () => {
              const nextValue = !isEnabled;
              await toggleTelegram?.(nextValue);
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

export default Telegram;
