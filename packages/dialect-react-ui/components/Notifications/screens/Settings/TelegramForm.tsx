import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

export interface TelegramFormProps {
  botURL?: string;
}

const type = AddressType.Telegram;

export function TelegramForm(props: TelegramFormProps) {
  const {
    addresses: { [type]: telegramAddress },
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

  const {
    textStyles,
    outlinedInput,
    colors,
    secondaryButton,
    secondaryButtonLoading,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
    highlighted,
  } = useTheme();

  const [telegramUsername, setTelegramUsername] = useState(
    telegramAddress?.value
  );
  const [isEnabled, setEnabled] = useState(Boolean(telegramAddress?.enabled));
  const [isTelegramUsernameEditing, setTelegramUsernameEditing] = useState(
    !telegramAddress?.enabled
  );
  const [error, setError] = useState<Error | null>(null);

  const [verificationCode, setVerificationCode] = useState('');

  const isTelegramSaved = Boolean(telegramAddress);
  const isChanging = telegramAddress && isTelegramUsernameEditing;
  const isVerified = telegramAddress?.verified;

  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    // Update state if addresses updated
    setTelegramUsername(telegramAddress?.value || '');
    setTelegramUsernameEditing(!telegramAddress?.enabled);
  }, [telegramAddress]);

  const updateTelegram = async () => {
    if (error) return;

    try {
      await updateAddress({
        type,
        value: telegramUsername,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setTelegramUsernameEditing(false);
    }
  };

  const saveTelegram = async () => {
    if (error) return;

    try {
      const value = telegramUsername?.replace('@', '');
      await createAddress({ type, value });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteTelegram = async () => {
    try {
      await deleteAddress({ type });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const resendCodeVerification = async () => {
    try {
      await resendCode({ type });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const sendCode = async () => {
    try {
      await verifyCode({ type, code: verificationCode });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setVerificationCode('');
    }
  };

  const renderVerifiedState = () => {
    return (
      <div className={clsx(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">🔗 Telegram submitted</span>
      </div>
    );
  };

  const renderVerificationCode = () => {
    return (
      <div className="dt-flex dt-flex-row dt-space-x-2">
        <input
          className={clsx('dt-w-full', outlinedInput)}
          placeholder="Enter verification code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button
          className="dt-basis-1/4"
          onClick={sendCode}
          disabled={verificationCode.length !== 6}
          loading={isVerifyingCode}
        >
          {isVerifyingCode ? 'Sending code...' : 'Submit'}
        </Button>
        <Button
          className="dt-basis-1/4"
          onClick={deleteTelegram}
          defaultStyle={secondaryButton}
          loadingStyle={secondaryButtonLoading}
          loading={isDeletingAddress}
        >
          {isDeletingAddress ? 'Deleting...' : 'Cancel'}
        </Button>
      </div>
    );
  };

  const renderInput = () => (
    <input
      className={clsx(
        outlinedInput,
        error && '!dt-border-red-500 !dt-text-red-500',
        'dt-w-full dt-basis-full'
      )}
      placeholder="Enter telegram username"
      type="text"
      value={telegramUsername}
      onChange={(e) => setTelegramUsername(e.target.value)}
      disabled={isTelegramSaved && !isTelegramUsernameEditing}
      onBlur={(e) =>
        e.target.checkValidity()
          ? setError(null)
          : setError({
              name: 'incorrectTelegramNumber',
              message: 'Please enter a valid telegram number',
            })
      }
      onInvalid={(e) => {
        e.preventDefault();
        setError({
          name: 'incorrectTelegramNumber',
          message: 'Please enter a valid telegram number',
        });
      }}
    />
  );

  return (
    <div key="telegram">
      <ToggleSection
        className="dt-mb-6"
        title="📡  Telegram notifications"
        onChange={async (nextValue) => {
          setError(null);
          if (telegramAddress && telegramAddress.enabled !== nextValue) {
            await toggleAddress({
              type,
              enabled: nextValue,
            });
          }
          setEnabled(!isEnabled);
        }}
        enabled={Boolean(telegramAddress?.enabled)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {isTelegramSaved && !isChanging ? (
                <>
                  {isVerified
                    ? renderVerifiedState()
                    : renderVerificationCode()}
                </>
              ) : null}
              {(!isTelegramSaved && isTelegramUsernameEditing) || isChanging
                ? renderInput()
                : null}
              {currentError && (
                <P
                  className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2')}
                >
                  {currentError.message}
                </P>
              )}
            </div>

            {/* 1. If the telegram wasn't submitted yet */}
            {!isTelegramSaved && isTelegramUsernameEditing ? (
              <Button
                className="dt-basis-full"
                disabled={telegramUsername === ''}
                onClick={saveTelegram}
                loading={isCreatingAddress}
              >
                {isCreatingAddress ? 'Saving...' : 'Submit telegram'}
              </Button>
            ) : null}

            {/* 2. If email already submited and user clicked "Change" */}
            {/* FIXME: this state got enabled right after first email submition */}
            {isChanging && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  defaultStyle={secondaryButton}
                  loadingStyle={secondaryButtonLoading}
                  className="dt-basis-1/2"
                  onClick={() => setTelegramUsernameEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={telegramUsername === ''}
                  onClick={updateTelegram}
                  loading={isUpdatingAddress}
                >
                  {isUpdatingAddress ? 'Saving...' : 'Submit telegram'}
                </Button>
              </div>
            ) : null}

            {!isTelegramUsernameEditing && !isVerified ? (
              <>
                <div
                  className={clsx(
                    textStyles.small,
                    'dt-flex dt-flex-row dt-space-x-2'
                  )}
                >
                  <a
                    className={clsx(textStyles.small)}
                    href={props.botURL}
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
                </div>
                <div className="dt-flex dt-flex-row dt-space-x-2">
                  <div
                    className={clsx(
                      textStyles.small,
                      'display: inline-flex',
                      'dt-mb-1'
                    )}
                    onClick={resendCodeVerification}
                  >
                    <span className="dt-opacity-50">
                      {' '}
                      Check your telegram bot{' '}
                      {telegramAddress?.value
                        ? `from @${telegramAddress?.value}`
                        : ''}{' '}
                      for a verification code.
                    </span>{' '}
                    <span className="dt-inline-block dt-cursor-pointer">
                      <ResendIcon
                        className={clsx(
                          'dt-inline-block dt-mr-0.5',
                          isSendingCode && 'dt-animate-spin'
                        )}
                        height={14}
                        width={14}
                      />
                      Resend code
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            {!isTelegramUsernameEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setTelegramUsernameEditing(true)}
                >
                  Change
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteTelegram}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete telegram'}
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && !isChanging && isTelegramUsernameEditing ? (
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your Telegram username is a global setting
              across all dapps. You will be prompted to sign with your wallet,
              this action is free.
            </P>
          ) : null}
        </form>
      </ToggleSection>
    </div>
  );
}
