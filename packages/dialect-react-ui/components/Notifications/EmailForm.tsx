import React, { useEffect, useState } from 'react';
import { useApi, DialectErrors, ParsedErrorData } from '@dialectlabs/react';
import type { AddressType } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { P } from '../common/preflighted';
import { Button, Toggle, ValueRow } from '../common';
import ResendIcon from '../Icon/Resend';

function getEmailObj(addresses: AddressType[] | null): AddressType | null {
  if (!addresses) return null;
  return addresses.find((address) => address.type === 'email') || null;
}

export function EmailForm() {
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
  const emailObj = getEmailObj(addresses);

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

  const [email, setEmail] = useState(emailObj?.value);
  const [isEnabled, setEnabled] = useState(Boolean(emailObj?.enabled));
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [emailError, setEmailError] = useState<ParsedErrorData | null>(null);

  const [verificationCode, setVerificationCode] = useState("");

  const isEmailSaved = Boolean(emailObj);
  const isChanging = emailObj && isEmailEditing;
  const isVerified = emailObj?.verified;

  const currentError =
    emailError ||
    fetchingAddressesError ||
    savingAddressError ||
    deletingAddressError || 
    verificationCodeError;

  useEffect(() => {
    // Update state if addresses updated
    setEnabled(Boolean(emailObj?.enabled));
    setEmail(emailObj?.value || '');
    setEmailEditing(!emailObj?.enabled);
  }, [emailObj]);

  const updateEmail = async () => {
    // TODO: validate & save email
    if (emailError) return;

    await updateAddress(wallet, {
      type: 'email',
      value: email,
      enabled: true,
      id: emailObj?.id,
      addressId: emailObj?.addressId,
    });

    setEmailEditing(false);
  };

  const saveEmail = async () => {
    if (emailError) return;

    await saveAddress(wallet, {
      type: 'email',
      value: email,
      enabled: true,
    });
  };

  const deleteEmail = async () => {
    await deleteAddress(wallet, {
      addressId: emailObj?.addressId,
    });
  };

  const resendEmailCode = async () => {
    await resendCode(wallet, {
      type: 'email',
      value: email,
      enabled: true,
      id: emailObj?.id,
      addressId: emailObj?.addressId})
  };

  const sendCode = async () => {
    await verifyCode(wallet, {
      type: 'email',
      value: email,
      enabled: true,
      id: emailObj?.id,
      addressId: emailObj?.addressId,
    }, verificationCode);

    setVerificationCode("")
  }

  const renderVerifiedState = () => {
    return (
      <div className={cs(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">🔗 Email submitted</span>
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
            onClick={deleteEmail}
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
        {isEmailSaved
          ? 'Email notifications are now enabled. Emails are stored securely off-chain.'
          : 'Receive notifications to your email. Emails are stored securely off-chain.'}
      </P>
      <ValueRow className="dt-mb-2" label="Enable email notifications">
        <Toggle
          type="checkbox"
          checked={isEnabled}
          onClick={async () => {
            const nextValue = !isEnabled;
            if (emailObj && emailObj.enabled !== nextValue) {
              // TODO: handle error
              await updateAddress(wallet, {
                id: emailObj.id,
                enabled: nextValue,
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
              {isEmailSaved && !isEmailEditing ? (
                <>
                  {isVerified ? renderVerifiedState() : renderVerificationCode()}
                </>
              ) : (
                <input
                  className={cs(
                    outlinedInput,
                    emailError && '!dt-border-red-500 !dt-text-red-500',
                    'dt-w-full dt-basis-full'
                  )}
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) =>
                    e.target.checkValidity()
                      ? setEmailError(null)
                      : setEmailError(DialectErrors.incorrectEmail)
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setEmailError(DialectErrors.incorrectEmail);
                  }}
                  pattern="^\S+@\S+\.\S+$"
                  disabled={isEmailSaved && !isEmailEditing}
                />
              )}
            </div>

            {isChanging && (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  defaultStyle={secondaryButton}
                  loadingStyle={secondaryButtonLoading}
                  className="dt-basis-1/2"
                  onClick={() => setEmailEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={email === ''}
                  onClick={updateEmail}
                  loading={isSavingAddress}
                >
                  {isSavingAddress ? 'Saving...' : 'Submit email'}
                </Button>
              </div>
            )}

            {!isChanging && isEmailEditing ? (
              <Button
                className="dt-basis-full"
                disabled={email === ''}
                onClick={saveEmail}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit email'}
              </Button>
            ) : null}

            {!isEmailEditing && !isVerified ? (
               <div className="dt-flex dt-flex-row dt-space-x-2">
                   <P className={cs(textStyles.small, 'display: inline-flex', 'dt-mb-1')} onClick={resendEmailCode}>
                      <span className='dt-opacity-50'> Email submitted, check {email} for verification code. If you haven’t received verification email:</span>
                      <div className='dt-inline-block dt-cursor-pointer'>
                        <ResendIcon className='dt-px-1 dt-inline-block' height={18} width={18} /> 
                        Resend code
                      </div>
                  </P>
              </div>
            ) : null}

            {!isEmailEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setEmailEditing(true)}
                  loading={isSavingAddress}
                >
                  Change email
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteEmail}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete email'}
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && !isChanging && isEmailEditing ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your email is a global setting across all
              dapps. You will be prompted to sign with your wallet, this action
              is free.
            </P>
          ) : null}
          {!currentError && !isEmailEditing && isVerified ? (
            <P className={cs(textStyles.small, 'dt-mb-1')}>
              You can now chill and receive all the events directly to your
              inbox.
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
