import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

const addressType = AddressType.Email;

export function EmailForm() {
  const {
    addresses: { [addressType]: emailAddress },
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

  const [email, setEmail] = useState(emailAddress?.value);
  const [isEmailEditing, setEmailEditing] = useState(!emailAddress?.enabled);
  const [verificationCode, setVerificationCode] = useState('');

  const [error, setError] = useState<Error | null>(null);

  const isEmailSaved = Boolean(emailAddress);
  const isChanging = emailAddress && isEmailEditing;
  const isVerified = emailAddress?.verified;

  const currentError = error || errorFetchingAddresses;

  // // FIXME: replace with key change
  useEffect(() => {
    // Update state if addresses updated
    setEmailEditing(!isEmailSaved && !emailAddress?.enabled);
    setEmail(emailAddress?.value || '');
  }, [isEmailSaved, emailAddress?.enabled, emailAddress?.value]);

  const updateEmail = async () => {
    // TODO: validate & save email
    if (error) {
      return;
    }
    try {
      await updateAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
    setEmailEditing(false);
  };

  const saveEmail = async () => {
    if (error) {
      return;
    }
    try {
      await createAddress({ addressType, value: email });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteEmail = async () => {
    try {
      await deleteAddress({ addressType });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const resendEmailCode = async () => {
    try {
      await resendCode({ addressType });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const sendCode = async () => {
    try {
      await verifyCode({ addressType, code: verificationCode });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setVerificationCode('');
    }
  };

  const toggleEmail = async (nextValue: boolean) => {
    if (!emailAddress || emailAddress?.enabled === nextValue) {
      return;
    }
    try {
      await toggleAddress({
        addressType,
        enabled: nextValue,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const renderVerifiedState = () => {
    return (
      <div className={clsx(highlighted, textStyles.body, colors.highlight)}>
        <span className="dt-opacity-40">
          🔗 Email {emailAddress.value} submitted
        </span>
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

  const renderInput = () => (
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
  );

  return (
    <div>
      <ToggleSection
        className="dt-mb-6"
        title="📩  Email notifications"
        onChange={toggleEmail}
        checked={Boolean(emailAddress?.enabled)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {/* TODO: review if it's sufficient condition */}
              {isEmailSaved && !isChanging ? (
                <>
                  {isVerified
                    ? renderVerifiedState()
                    : renderVerificationCode()}
                </>
              ) : null}
              {(!isEmailSaved && isEmailEditing) || isChanging
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

            {/* 1. If the email wasn't submitted */}
            {!isEmailSaved && isEmailEditing ? (
              <Button
                className="dt-basis-full"
                disabled={email === ''}
                onClick={saveEmail}
                loading={isCreatingAddress}
              >
                {isCreatingAddress ? 'Saving...' : 'Submit email'}
              </Button>
            ) : null}

            {/* 2. If email already submitted and user clicks "Change" */}
            {/* FIXME: this state is enabled right after first email submission */}
            {isChanging && isVerified && (
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
                  loading={isUpdatingAddress}
                >
                  {isUpdatingAddress ? 'Saving...' : 'Submit email'}
                </Button>
              </div>
            )}

            {/* 3. User submitted an email and now promted to verification */}
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
                    Check your email {emailAddress?.value} for a verification
                    code.
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
            ) : null}

            {/* 4. User submitted and verified an email, and there's no user interaction yet */}
            {!isEmailEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setEmailEditing(true)}
                  loading={isUpdatingAddress}
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

          {/* Errors / Caption */}
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
