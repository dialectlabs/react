import { useEffect, useState } from 'react';
import { useApi, DialectErrors, ParsedErrorData } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { P } from '../common/preflighted';
import { Button, ToggleSection } from '../common';
import ResendIcon from '../Icon/Resend';

export function EmailForm() {
  const {
    wallet,
    addresses: { email: emailObj },
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
    resendCode,
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
    button,
  } = useTheme();

  const [email, setEmail] = useState(emailObj?.value);
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [emailError, setEmailError] = useState<ParsedErrorData | null>(null);

  const [verificationCode, setVerificationCode] = useState('');

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
      addressId: emailObj?.addressId,
    });
  };

  const sendCode = async () => {
    await verifyCode(
      wallet,
      {
        type: 'email',
        value: email,
        enabled: true,
        id: emailObj?.id,
        addressId: emailObj?.addressId,
      },
      verificationCode
    );

    setVerificationCode('');
  };

  const renderVerifiedState = () => {
    return (
      <div className={cs(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">🔗 Email submitted</span>
      </div>
    );
  };

  const renderVerificationCode = () => {
    return (
      <div className="dt-flex dt-flex-row dt-space-x-2">
        <input
          className={cs('dt-w-full', outlinedInput)}
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
    );
  };

  return (
    <div>
      <ToggleSection
        className="dt-mb-6"
        title="📩  Email notifications"
        onChange={async (nextValue) => {
          if (emailObj && emailObj.enabled !== nextValue) {
            // TODO: handle error
            await updateAddress(wallet, {
              id: emailObj.id,
              enabled: nextValue,
            });
          }
        }}
        enabled={Boolean(emailObj?.enabled)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {isEmailSaved && !isEmailEditing ? (
                <>
                  {isVerified
                    ? renderVerifiedState()
                    : renderVerificationCode()}
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
                <div
                  className={cs(
                    textStyles.small,
                    'display: inline-flex',
                    'dt-mb-1'
                  )}
                  onClick={resendEmailCode}
                >
                  <span className="dt-opacity-50">
                    {' '}
                    Check your email for a verification code.
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
