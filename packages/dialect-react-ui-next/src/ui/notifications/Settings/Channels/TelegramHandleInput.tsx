import {
  AddressType,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, Input } from '../../../core/primitives';
import { ClassTokens, Icons } from '../../../theme';
import { ChannelNotificationsToggle } from './ChannelNotificationsToggle';

export const TelegramHandleInput = ({
  dappAddress,
}: {
  dappAddress: string;
}) => {
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
  } = useNotificationChannel({ addressType: AddressType.Telegram });

  const {
    enabled: subscriptionEnabled,
    toggleSubscription,
    isToggling,
  } = useNotificationChannelDappSubscription({
    addressType: AddressType.Telegram,
    dappAddress,
  });

  const [telegramUsername, setTelegramUsername] = useState(
    telegramAddress?.value || '',
  );
  const [error, setError] = useState<Error | null>(null);
  const [isUserDeleting, setIsUserDeleting] = useState(false);

  const isTelegramSaved = Boolean(telegramAddress);
  const isVerified = Boolean(telegramAddress?.verified);
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

  const toggleTelegram = async (next: boolean) => {
    try {
      await toggleSubscription({
        enabled: next,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const isUserEditing =
    telegramAddress?.value !== telegramUsername && isTelegramSaved;

  const getButton = () => {
    if (!telegramUsername) return null;
    if (isLoading) {
      return (
        <Button disabled>
          <Icons.Loader />
        </Button>
      );
    }
    if (isUserDeleting) {
      return <Button onClick={deleteTelegram}>Delete</Button>;
    }
    if (isUserEditing) {
      return <Button onClick={updateTelegram}>Submit</Button>;
    }
    if (isVerified) {
      return <Icons.Trash onClick={() => setIsUserDeleting(true)} />;
    }

    return <Button onClick={saveTelegram}>Submit</Button>;
  };

  return (
    <div>
      <Input
        label="Telegram"
        placeholder="Enter you Telegram @Username"
        id="settings-telegram"
        value={telegramUsername}
        onChange={(e) => {
          setTelegramUsername(e.target.value);
        }}
        rightAdornment={getButton()}
      />
      <div className="dt-mt-1 dt-flex dt-flex-row dt-items-center dt-space-x-2">
        <ChannelNotificationsToggle
          enabled={subscriptionEnabled}
          onChange={toggleTelegram}
        />
      </div>

      <div className="dt-mb-1 dt-mt-1 dt-inline-flex dt-items-center">
        {isUserDeleting && (
          <div>
            <span
              className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}
            >
              Deleting your telegram handle here will delete it across all dapps
              you&apos;ve signed up.
            </span>
            <span
              onClick={() => setIsUserDeleting(false)}
              className={clsx(
                ClassTokens.Text.Brand,
                'dt-text-semibold dt-inline-flex dt-cursor-pointer dt-items-center dt-text-subtext',
              )}
            >
              <Icons.Xmark
                className={clsx('dt-mb-0.5 dt-mr-0.5 dt-inline-block')}
                height={12}
                width={12}
              />
              Cancel
            </span>
          </div>
        )}
        {isUserEditing && (
          <div>
            <span className={clsx(ClassTokens.Text.Error, 'dt-text-caption')}>
              Updating your telegram handle here will update it across all dapps
              you&apos;ve signed up.
            </span>
            <span
              onClick={() => {
                setTelegramUsername(telegramAddress?.value || '');
              }}
              className={clsx(
                ClassTokens.Text.Brand,
                'dt-text-semibold dt-inline-flex dt-cursor-pointer dt-items-center dt-text-subtext',
              )}
            >
              <Icons.Xmark
                className={clsx('dt-mb-0.5 dt-mr-0.5 dt-inline-block')}
                height={12}
                width={12}
              />
              Cancel
            </span>
          </div>
        )}
      </div>
      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}
    </div>
  );
};
