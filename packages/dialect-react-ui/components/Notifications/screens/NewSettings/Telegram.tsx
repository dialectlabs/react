import { Toggle } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import {
  AddressType,
  useDapp,
  useDialectDapp,
  useDialectSdk,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
} from '@dialectlabs/react-sdk';
import { useEffect, useMemo, useState } from 'react';
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
    globalAddress: telegramAddress,
    create: createAddress,
    delete: deleteAddress,
    update: updateAddress,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSendingCode,
    isVerifyingCode,

    errorFetching: errorFetchingAddresses,
  } = useNotificationChannel({ addressType });

  const {
    enabled: subscriptionEnabled,
    toggleSubscription,
    isToggling,
  } = useNotificationChannelDappSubscription({ addressType });

  const { dapps } = useDapp({ verified: false });
  const { dappAddress } = useDialectDapp();

  const { textStyles, colors } = useTheme();

  const [telegramUsername, setTelegramUsername] = useState(
    telegramAddress?.value || ''
  );
  const [error, setError] = useState<Error | null>(null);
  const [isUserDeleting, setIsUserDeleting] = useState(false);

  const isTelegramSaved = Boolean(telegramAddress);
  const isVerified = telegramAddress?.verified || false;
  const isLoading =
    isCreatingAddress ||
    isUpdatingAddress ||
    isDeletingAddress ||
    isSendingCode ||
    isVerifyingCode ||
    isToggling;

  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    setTelegramUsername(telegramAddress?.value || '');
  }, [isTelegramSaved, telegramAddress?.value]);

  const updateTelegram = async () => {
    try {
      await updateAddress({
        value: telegramUsername,
      });
      setError(null);
      setIsUserDeleting(false);
    } catch (e) {
      setError(e as Error);
    }
  };

  const saveTelegram = async () => {
    try {
      const value = telegramUsername.replace('@', '');
      const address = await createAddress({ value });
      await toggleSubscription({ enabled: true, address });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteTelegram = async () => {
    try {
      await deleteAddress();
      setIsUserDeleting(false);
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
      await toggleSubscription({
        enabled: nextValue,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const buildBotUrl = (botUsername: string) =>
    `https://t.me/${botUsername}?start=${botUsername}`;

  const defaultBotUrl =
    environment === 'production'
      ? buildBotUrl('DialectLabsBot')
      : buildBotUrl('DialectLabsDevBot');

  const botURL = useMemo(() => {
    if (!dappAddress) {
      return defaultBotUrl;
    }
    const dapp = dapps[dappAddress.toBase58()];
    if (!dapp) {
      return defaultBotUrl;
    }
    return buildBotUrl(dapp.telegramUsername);
  }, [dappAddress, dapps, defaultBotUrl]);

  const isUserEditing =
    telegramAddress?.value !== telegramUsername && isTelegramSaved;

  return (
    <div>
      <label
        htmlFor="settings-telegram"
        className={clsx(colors.label, textStyles.label, 'dt-block dt-mb-1')}
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
                <span className="dt-underline">this bot</span>
                <span className="dt-opacity-50"> with command: /start </span>
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
              isChanging={isUserEditing}
              isVerified={isVerified}
              onSaveCallback={saveTelegram}
              onDeleteCallback={deleteTelegram}
              onUpdateCallback={updateTelegram}
              deleteConfirm={(isDelete) => {
                setIsUserDeleting(isDelete);
              }}
              isDeleting={isUserDeleting}
            />
          }
        />
      )}

      {(isUserDeleting || isUserEditing) && (
        <div
          className={clsx(
            textStyles.small,
            'display: inline-flex',
            'dt-mb-1 dt-mt-1'
          )}
        >
          {isUserDeleting && (
            <div>
              <span className="dt-opacity-60">
                Deleting your telegram handle here will delete it across all
                dapps you've signed up.
              </span>
              <span
                onClick={() => setIsUserDeleting(false)}
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
          {isUserEditing && (
            <div>
              <span className="dt-opacity-60">
                Updating your telegram handle here will update it across all
                dapps you've signed up.
              </span>
              <span
                onClick={() => {
                  setTelegramUsername(telegramAddress?.value || '');
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

      {isTelegramSaved && isVerified && !isUserEditing && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            checked={subscriptionEnabled}
            toggleSize="S"
            onChange={(value) => {
              if (isToggling) return;
              return toggleTelegram(value);
            }}
          />

          <P className={clsx(textStyles.small, 'dt-opacity-60')}>
            Notifications {subscriptionEnabled ? 'on' : 'off'}
          </P>
        </div>
      )}
    </div>
  );
};

export default Telegram;
