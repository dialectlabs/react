import React, { useEffect, useState } from 'react';
import { useApi, DialectErrors, ParsedErrorData } from '@dialectlabs/react';
import type { AddressType } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { P } from '../common/preflighted';
import { Button, Toggle, ToggleSection, ValueRow } from '../common';
import ResendIcon from '../Icon/Resend';

export interface TelegramFormProps {
    botURL?: string;
}

function getTelegramObj(addresses: AddressType[] | null): AddressType | null {
  if (!addresses) return null;
  return addresses.find((address) => address.type === 'telegram') || null;
}

export function TelegramForm(props: TelegramFormProps) {
  const {
    wallet,
    addresses: { telegram: telegramObj },
    fetchingAddressesError,
    saveAddress,
    isSavingAddress,
    savingAddressError,
    updateAddress,
    deleteAddress,
    isDeletingAddress,
    deletingAddressError,
    verificationCodeError,
    isSendingCode,
    verifyCode,
    resendCode
  } = useApi();

  const {
    textStyles,
    outlinedInput,
    colors,
    secondaryButton,
    secondaryButtonLoading,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
    highlighted,
    disabledButton,
    button
  } = useTheme();

  const [telegramUsername, setTelegramUsername] = useState(telegramObj?.value);
  const [isEnabled, setEnabled] = useState(Boolean(telegramObj?.enabled));
  const [isTelegramUsernameEditing, setTelegramUsernameEditing] = useState(!telegramObj?.enabled);
  const [telegramError, setTelegramError] = useState<ParsedErrorData | null>(null);

  const [verificationCode, setVerificationCode] = useState("");

  const isTelegramSaved = Boolean(telegramObj);
  const isChanging = telegramObj && isTelegramUsernameEditing;
  const isVerified = telegramObj?.verified;

  const currentError =
    telegramError ||
    fetchingAddressesError ||
    savingAddressError ||
    deletingAddressError || 
    verificationCodeError;

  useEffect(() => {
    // Update state if addresses updated
    setTelegramUsername(telegramObj?.value || '');
    setTelegramUsernameEditing(!telegramObj?.enabled);
  }, [telegramObj]);

  const updateTelegram = async () => {
    if (telegramError) return;

    await updateAddress(wallet, {
      type: 'telegram',
      value: telegramUsername,
      enabled: true,
      id: telegramObj?.id,
      addressId: telegramObj?.addressId,
    });

    setTelegramUsernameEditing(false);
  };

  const saveTelegram = async () => {
    if (telegramError) return;

    let value = telegramUsername?.replace('@', '');

    await saveAddress(wallet, {
      type: 'telegram',
      value: value,
      enabled: true,
    });
  };

  const deleteTelegram = async () => {
    await deleteAddress(wallet, {
      addressId: telegramObj?.addressId,
    });
  };

  const resendCodeVerification = async () => {
    await resendCode(wallet, {
      type: 'telegram',
      value: telegramUsername,
      enabled: true,
      id: telegramObj?.id,
      addressId: telegramObj?.addressId})
  };

  const sendCode = async () => {
    // TODO verifyEmail should just be verifyAddress
    await verifyCode(wallet, {
      type: 'telegram',
      value: telegramUsername,
      enabled: true,
      id: telegramObj?.id,
      addressId: telegramObj?.addressId,
    }, verificationCode);

    setVerificationCode("")
  }

  const renderVerifiedState = () => {
    return (
      <div className={cs(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">🔗 Telegram submitted</span>
     </div>
    )
  }

  const renderVerificationCode = () => {
    return (
      <div className='dt-flex dt-flex-row dt-space-x-2'>
       <input
          className={cs(
            'dt-w-full',
            outlinedInput,
          )}
          placeholder="Enter verification code"
          type="text"  
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Button
            className="dt-basis-1/4"
            onClick={sendCode}
            defaultStyle={verificationCode.length !== 6 ? disabledButton : button}
            disabled={verificationCode.length !== 6}
            loading={isSendingCode}
          >
              {isSendingCode ? 'Sending code...' : 'Submit'}
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
    )
  }

  return (
    <div>
      <ToggleSection
        className="dt-mb-6"
        title="📡  Telegram notifications"
        onChange={async (nextValue) => {
          if (telegramObj && telegramObj.enabled !== nextValue) {
            // TODO: handle error
            await updateAddress(wallet, {
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
                  {isVerified ? renderVerifiedState() : renderVerificationCode()}
                </>
              ) : (
                <input
                  className={cs(
                    outlinedInput,
                    telegramError && '!dt-border-red-500 !dt-text-red-500',
                    'dt-w-full dt-basis-full'
                  )}
                  placeholder="Enter telegram username"
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  disabled={isTelegramSaved && !isTelegramUsernameEditing}
                />
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
                  loading={isSavingAddress}
                >
                  {isSavingAddress ? 'Saving...' : 'Submit telegram'}
                </Button>
              </div>
            )}

            {!isChanging && isTelegramUsernameEditing ? (
              <Button
                className="dt-basis-full"
                disabled={telegramUsername === ''}
                onClick={saveTelegram}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit telegram'}
              </Button>
            ) : null}

            {!isTelegramUsernameEditing && !isVerified ? (
               <>
                <div className={cs(textStyles.small, "dt-flex dt-flex-row dt-space-x-2")}>
                    <a className={cs(textStyles.small)} href={props.botURL} target="_blank">
                        🤖 
                        <span className='dt-opacity-50'> Get verification code by starting </span>
                        <span className='dt-underline'>this bot </span> 
                        <span className='dt-opacity-50'>with command: /start</span>
                    </a>   
                </div> 
                <div className="dt-flex dt-flex-row dt-space-x-2">
                    <div className={cs(textStyles.small, 'display: inline-flex', 'dt-mb-1')} onClick={resendCodeVerification}>
                        <span className='dt-opacity-50'> Check your telegram bot for a verification code.</span>
                        <div className='dt-inline-block dt-cursor-pointer'>
                            <ResendIcon className='dt-px-1 dt-inline-block' height={18} width={18} /> 
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
                  loading={isSavingAddress}
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
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your Telegram username is a global setting across all
              dapps. You will be prompted to sign with your wallet, this action
              is free.
            </P>
          ) : null}
        </form>
      </ToggleSection>
      {currentError && (
        <P className={cs(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </P>
      )}
    </div>
  );
}
