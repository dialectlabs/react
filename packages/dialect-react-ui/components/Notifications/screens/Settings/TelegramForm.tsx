import type { AddressType } from '@dialectlabs/react';
import { useDialectCloudApi } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

export interface TelegramFormProps {
  botURL?: string;
}

function getTelegramObj(addresses: AddressType[] | null): AddressType | null {
  if (!addresses) return null;
  return addresses.find((address) => address.type === 'telegram') || null;
}

export function TelegramForm(props: TelegramFormProps) {
  const {
    addresses: { telegram: telegramObj },
    fetchingAddressesError,
    saveAddress,
    updateAddress,
    deleteAddress,
    verifyCode,
    resendCode,
  } = useDialectCloudApi();

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

  const [telegramUsername, setTelegramUsername] = useState(telegramObj?.value);
  const [isEnabled, setEnabled] = useState(Boolean(telegramObj?.enabled));
  const [isTelegramUsernameEditing, setTelegramUsernameEditing] = useState(
    !telegramObj?.enabled
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');

  const isTelegramSaved = Boolean(telegramObj);
  const isChanging = telegramObj && isTelegramUsernameEditing;
  const isVerified = telegramObj?.verified;

  const currentError = error || fetchingAddressesError;

  useEffect(() => {
    // Update state if addresses updated
    setTelegramUsername(telegramObj?.value || '');
    setTelegramUsernameEditing(!telegramObj?.enabled);
  }, [telegramObj]);

  const updateTelegram = async () => {
    if (error) return;

    try {
      setLoading(true);
      await updateAddress({
        type: 'telegram',
        value: telegramUsername,
        enabled: true,
        id: telegramObj?.id,
        addressId: telegramObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setTelegramUsernameEditing(false);
    }
  };

  const saveTelegram = async () => {
    if (error) return;

    try {
      setLoading(true);
      const value = telegramUsername?.replace('@', '');
      await saveAddress({
        type: 'telegram',
        value: value,
        enabled: true,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTelegram = async () => {
    try {
      setLoading(true);
      await deleteAddress({
        addressId: telegramObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const resendCodeVerification = async () => {
    try {
      setLoading(true);
      await resendCode({
        type: 'telegram',
        value: telegramUsername,
        enabled: true,
        id: telegramObj?.id,
        addressId: telegramObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    try {
      setLoading(true);
      await verifyCode(
        {
          type: 'telegram',
          value: telegramUsername,
          enabled: true,
          id: telegramObj?.id,
          addressId: telegramObj?.addressId,
        },
        verificationCode
      );
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
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
          loading={loading}
        >
          {loading ? 'Sending code...' : 'Submit'}
        </Button>
        <Button
          className="dt-basis-1/4"
          onClick={deleteTelegram}
          defaultStyle={secondaryButton}
          loadingStyle={secondaryButtonLoading}
          loading={loading}
        >
          {loading ? 'Deleting...' : 'Cancel'}
        </Button>
      </div>
    );
  };

  return (
    <div key="telegram">
      <ToggleSection
        className="dt-mb-6"
        title="📡  Telegram notifications"
        onChange={async (nextValue) => {
          setError(null);
          if (telegramObj && telegramObj.enabled !== nextValue) {
            await updateAddress({
              id: telegramObj.id,
              enabled: nextValue,
              type: 'telegram',
              addressId: !telegramObj.id ? telegramObj?.addressId : undefined,
            });
          }
          setEnabled(!isEnabled);
        }}
        enabled={Boolean(telegramObj?.enabled)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {isTelegramSaved && !isTelegramUsernameEditing ? (
                <>
                  {isVerified
                    ? renderVerifiedState()
                    : renderVerificationCode()}
                </>
              ) : (
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
              )}
              {currentError && (
                <P
                  className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2')}
                >
                  {currentError.message}
                </P>
              )}
            </div>

            {isChanging && (
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
                  loading={loading}
                >
                  {loading ? 'Saving...' : 'Submit telegram'}
                </Button>
              </div>
            )}

            {!isChanging && isTelegramUsernameEditing ? (
              <Button
                className="dt-basis-full"
                disabled={telegramUsername === ''}
                onClick={saveTelegram}
                loading={loading}
              >
                {loading ? 'Saving...' : 'Submit telegram'}
              </Button>
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
                      Check your telegram bot for a verification code.
                    </span>
                    <div className="dt-inline-block dt-cursor-pointer">
                      <ResendIcon
                        className="dt-px-1 dt-inline-block"
                        height={18}
                        width={18}
                      />
                      Resend code
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {!isTelegramUsernameEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setTelegramUsernameEditing(true)}
                  loading={loading}
                >
                  Change
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteTelegram}
                  loading={loading}
                >
                  {loading ? 'Deleting...' : 'Delete telegram'}
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
