import {
  AddressType,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ButtonType, Input, TextButton } from '../../../../core';
import { ClassTokens, Icons } from '../../../../theme';
import { ChannelNotificationsToggle } from '../ChannelNotificationsToggle';

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
      setTelegramUsername('');
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
        <div className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}>
          <Icons.Loader />
        </div>
      );
    }
    if (isUserDeleting) {
      return (
        <Button onClick={deleteTelegram} type={ButtonType.Destructive}>
          Delete
        </Button>
      );
    }
    if (isUserEditing) {
      return <Button onClick={updateTelegram}>Submit</Button>;
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

    return <Button onClick={saveTelegram}>Submit</Button>;
  };

  return (
    <div>
      <Input
        label="Telegram"
        placeholder="Enter your Telegram @Username"
        id="settings-telegram"
        value={telegramUsername}
        disabled={isLoading || isUserDeleting}
        onChange={(e) => {
          setTelegramUsername(e.target.value);
        }}
        rightAdornment={getButton()}
      />

      {isTelegramSaved && isVerified && !isUserEditing && !isUserDeleting && (
        <div className="dt-mt-2">
          <ChannelNotificationsToggle
            enabled={subscriptionEnabled}
            onChange={toggleTelegram}
          />
        </div>
      )}

      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}

      {isUserDeleting && (
        <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
          <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
            Deleting your Telegram handle here will delete it across all dapps
            you’ve signed up.
          </p>
          <TextButton onClick={() => setIsUserDeleting(false)}>
            <Icons.Xmark height={12} width={12} />
            Cancel
          </TextButton>
        </div>
      )}

      {isUserEditing && (
        <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
          <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
            Updating your Telegram handle here will update it across all dapps
            you’ve signed up.
          </p>
          <TextButton
            onClick={() => {
              setTelegramUsername(telegramAddress?.value || '');
            }}
          >
            <Icons.Xmark height={12} width={12} />
            Cancel
          </TextButton>
        </div>
      )}
    </div>
  );
};
