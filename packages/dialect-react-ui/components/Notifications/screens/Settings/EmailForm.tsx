import { useDialectCloudApi } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

export function EmailForm() {
  const {
    addresses: { email: emailObj },
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

  const [email, setEmail] = useState(emailObj?.value);
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const isEmailSaved = Boolean(emailObj);
  const isChanging = emailObj && isEmailEditing;
  const isVerified = emailObj?.verified;

  const currentError = error || fetchingAddressesError;

  useEffect(() => {
    // Update state if addresses updated
    setEmail(emailObj?.value || '');
    setEmailEditing(!emailObj?.enabled);
  }, [emailObj]);

  const updateEmail = async () => {
    // TODO: validate & save email
    if (error) return;
    try {
      setLoading(true);
      await updateAddress({
        type: 'email',
        value: email,
        enabled: true,
        id: emailObj?.id,
        addressId: emailObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setEmailEditing(false);
    }
  };

  const saveEmail = async () => {
    if (error) return;

    try {
      setLoading(true);
      await saveAddress({
        type: 'email',
        value: email,
        enabled: true,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async () => {
    try {
      setLoading(true);
      await deleteAddress({
        addressId: emailObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const resendEmailCode = async () => {
    try {
      setLoading(true);
      await resendCode({
        type: 'email',
        value: email,
        enabled: true,
        id: emailObj?.id,
        addressId: emailObj?.addressId,
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
          type: 'email',
          value: email,
          enabled: true,
          id: emailObj?.id,
          addressId: emailObj?.addressId,
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
        <span className="dt-opacity-40">🔗 Email submitted</span>
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
          onClick={deleteEmail}
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
    <div>
      <ToggleSection
        className="dt-mb-6"
        title="📩  Email notifications"
        onChange={async (nextValue) => {
          if (emailObj && emailObj.enabled !== nextValue) {
            setError(null);
            await updateAddress({
              id: emailObj.id,
              type: emailObj.type,
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
                  className={clsx(
                    outlinedInput,
                    error && '!dt-border-red-500 !dt-text-red-500',
                    'dt-w-full dt-basis-full'
                  )}
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) =>
                    e.target.checkValidity()
                      ? setError(null)
                      : setError({
                          name: 'incorrectEmail',
                          message: 'Please enter a valid email',
                        })
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setError({
                      name: 'incorrectEmail',
                      message: 'Please enter a valid email',
                    });
                  }}
                  pattern="^\S+@\S+\.\S+$"
                  disabled={isEmailSaved && !isEmailEditing}
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
                  onClick={() => setEmailEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={email === ''}
                  onClick={updateEmail}
                  loading={loading}
                >
                  {loading ? 'Saving...' : 'Submit email'}
                </Button>
              </div>
            )}

            {!isChanging && isEmailEditing ? (
              <Button
                className="dt-basis-full"
                disabled={email === ''}
                onClick={saveEmail}
                loading={loading}
              >
                {loading ? 'Saving...' : 'Submit email'}
              </Button>
            ) : null}

            {!isEmailEditing && !isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <div
                  className={clsx(
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
                  loading={loading}
                >
                  Change email
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteEmail}
                  loading={loading}
                >
                  {loading ? 'Deleting...' : 'Delete email'}
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && !isChanging && isEmailEditing ? (
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your email is a global setting across all
              dapps. You will be prompted to sign with your wallet, this action
              is free.
            </P>
          ) : null}
        </form>
      </ToggleSection>
    </div>
  );
}
