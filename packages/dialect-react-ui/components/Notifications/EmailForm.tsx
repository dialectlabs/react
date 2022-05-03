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
    updateAddress,
    deleteAddress,
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
      await updateAddress(wallet, {
        type: 'email',
        value: email,
        enabled: true,
        id: emailObj?.id,
        addressId: emailObj?.addressId,
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      setEmailEditing(false);
    }
  };

  const saveEmail = async () => {
    if (error) return;

    try {
      setLoading(true);
      await saveAddress(wallet, {
        type: 'email',
        value: email,
        enabled: true,
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false)
    }
  };

  const deleteEmail = async () => {
    try {
      setLoading(true);
      await deleteAddress(wallet, {
        addressId: emailObj?.addressId,
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const resendEmailCode = async () => {
    try {
      setLoading(true);
      await resendCode(wallet, {
        type: 'email',
        value: email,
        enabled: true,
        id: emailObj?.id,
        addressId: emailObj?.addressId,
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    try {
      setLoading(true);
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
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
      setVerificationCode('');
    }
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
                      : setError({name: "incorrectEmail", message: "Please enter a valid email"})
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setError({name: "incorrectEmail", message: "Please enter a valid email"})
                  }}
                  pattern="^\S+@\S+\.\S+$"
                  disabled={isEmailSaved && !isEmailEditing}
                />
              )}
              {currentError && (
                  <P className={cs(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
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
    </div>
  );
}
