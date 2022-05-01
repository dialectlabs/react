import React, { useEffect, useState } from 'react';
import { useApi, DialectErrors, ParsedErrorData } from '@dialectlabs/react';
import type { AddressType } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { P } from '../common/preflighted';
import { Button, Toggle, ValueRow } from '../common';
import ResendIcon from '../Icon/Resend';

function getSmsObj(addresses: AddressType[] | null): AddressType | null {
  if (!addresses) return null;
  return addresses.find((address) => address.type === 'sms') || null;
}

export function SmsForm() {
  const {
    wallet,
    addresses,
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
  const smsObj = getSmsObj(addresses);

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

  const [smsNumber, setSmsNumber] = useState(smsObj?.value);
  const [isEnabled, setEnabled] = useState(Boolean(smsObj?.enabled));
  const [isSmsNumberEditing, setSmsNumberEditing] = useState(!smsObj?.enabled);
  const [smsNumberError, setSmsNumberError] = useState<ParsedErrorData | null>(null);

  const [verificationCode, setVerificationCode] = useState("");

  const isSmsNumberSaved = Boolean(smsObj);
  const isChanging = smsObj && isSmsNumberEditing;
  const isVerified = smsObj?.verified;

  const currentError =
    smsNumberError ||
    fetchingAddressesError ||
    savingAddressError ||
    deletingAddressError || 
    verificationCodeError;

  useEffect(() => {
    // Update state if addresses updated
    setEnabled(Boolean(smsObj?.enabled));
    setSmsNumber(smsObj?.value || '');
    setSmsNumberEditing(!smsObj?.enabled);
  }, [smsObj]);

  const updateSmsNumber = async () => {
    // TODO: validate & save sms number
    if (smsNumberError) return;

    await updateAddress(wallet, {
      type: 'sms',
      value: smsNumber,
      enabled: true,
      id: smsObj?.id,
      addressId: smsObj?.addressId,
    });

    setSmsNumberEditing(false);
  };

  const saveSmsNumber = async () => {
    if (smsNumberError) return;

    await saveAddress(wallet, {
      type: 'sms',
      value: smsNumber,
      enabled: true,
    });
  };

  const deleteSmsNumber = async () => {
    await deleteAddress(wallet, {
      addressId: smsObj?.addressId,
    });
  };

  const resendSmsVerificationCode = async () => {
    await resendCode(wallet, {
      type: 'sms',
      value: smsNumber,
      enabled: true,
      id: smsObj?.id,
      addressId: smsObj?.addressId})
  };

  const sendCode = async () => {
    // TODO verifyEmail should just be verifyAddress
    await verifyCode(wallet, {
      type: 'sms',
      value: smsNumber,
      enabled: true,
      id: smsObj?.id,
      addressId: smsObj?.addressId,
    }, verificationCode);

    setVerificationCode("")
  }

  const renderVerifiedState = () => {
    return (
      <div className={cs(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">🔗 Phone number submitted</span>
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
            onClick={deleteSmsNumber}
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
      <P className={cs(textStyles.small, 'dt-opacity-50 dt-mb-3')}>
        {isSmsNumberSaved && isVerified
          ? 'SMS notifications are now enabled. Phone numbers are stored securely off-chain.'
          : 'Receive notifications to your phone. Phone numbers are stored securely off-chain.'}
      </P>
      <ValueRow className="dt-mb-2" label="Enable SMS notifications">
        <Toggle
          type="checkbox"
          checked={isEnabled}
          onClick={async () => {
            const nextValue = !isEnabled;
            if (smsObj && smsObj.enabled !== nextValue) {
              // TODO: handle error
              await updateAddress(wallet, {
                id: smsObj.id,
                enabled: nextValue,
                type: 'sms',
                addressId: !smsObj.id ? smsObj?.addressId : undefined,
              });
            }
            setEnabled(!isEnabled);
          }}
        />
      </ValueRow>
      {isEnabled && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {isSmsNumberSaved && !isSmsNumberEditing ? (
                <>
                  {isVerified ? renderVerifiedState() : renderVerificationCode()}
                </>
              ) : (
                <input
                  className={cs(
                    outlinedInput,
                    smsNumberError && '!dt-border-red-500 !dt-text-red-500',
                    'dt-w-full dt-basis-full'
                  )}
                  placeholder="+15554443333 (+1 required, US only)"
                  type="sms"
                  value={smsNumber}
                  onChange={(e) => setSmsNumber(e.target.value)}
                  onBlur={(e) =>
                    e.target.checkValidity()
                      ? setSmsNumberError(null)
                      : setSmsNumberError(DialectErrors.incorrectSmsNumber)
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setSmsNumberError(DialectErrors.incorrectSmsNumber);
                  }}
                 // pattern="^\S+@\S+\.\S+$"
                  disabled={isSmsNumberSaved && !isSmsNumberEditing}
                />
              )}
            </div>

            {isChanging && (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  defaultStyle={secondaryButton}
                  loadingStyle={secondaryButtonLoading}
                  className="dt-basis-1/2"
                  onClick={() => setSmsNumberEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={smsNumber === ''}
                  onClick={updateSmsNumber}
                  loading={isSavingAddress}
                >
                  {isSavingAddress ? 'Saving...' : 'Submit number'}
                </Button>
              </div>
            )}

            {!isChanging && isSmsNumberEditing ? (
              <Button
                className="dt-basis-full"
                disabled={smsNumber === ''}
                onClick={saveSmsNumber}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit number'}
              </Button>
            ) : null}

            {!isSmsNumberEditing && !isVerified ? (
               <div className="dt-flex dt-flex-row dt-space-x-2">
                   <P className={cs(textStyles.small, 'display: inline-flex', 'dt-mb-1')} onClick={resendSmsVerificationCode}>
                      <span className='dt-opacity-50'> Check your phone for a verification code.</span>
                      <div className='dt-inline-block dt-cursor-pointer'>
                        <ResendIcon className='dt-px-1 dt-inline-block' height={18} width={18} /> 
                        Resend code
                      </div>
                  </P>
              </div>
            ) : null}

            {!isSmsNumberEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setSmsNumberEditing(true)}
                  loading={isSavingAddress}
                >
                  Change
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteSmsNumber}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete number'}
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && !isChanging && isSmsNumberEditing ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your SMS number is a global setting across all
              dapps. You will be prompted to sign with your wallet, this action
              is free.
            </P>
          ) : null}
        </form>
      )}
      {currentError && (
        <P className={cs(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </P>
      )}
    </div>
  );
}
