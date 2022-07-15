import { AddressType, useAddresses } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

const type = AddressType.PhoneNumber;

export function SmsForm() {
  const {
    addresses: { [type]: smsAddress },
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

  const [smsNumber, setSmsNumber] = useState(smsAddress?.value);
  const [isSmsNumberEditing, setSmsNumberEditing] = useState(
    !smsAddress?.enabled
  );
  const [error, setError] = useState<Error | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const isSmsNumberSaved = Boolean(smsAddress);
  const isChanging = smsAddress && isSmsNumberEditing;
  const isVerified = smsAddress?.verified;

  const currentError = error || errorFetchingAddresses;

  useEffect(() => {
    // Update state if addresses updated
    setSmsNumber(smsAddress?.value || '');
    setSmsNumberEditing(!smsAddress?.enabled);
  }, [smsAddress]);

  const updateSmsNumber = async () => {
    if (error) return;

    try {
      await updateAddress({ type, value: smsNumber });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setSmsNumberEditing(false);
    }
  };

  const saveSmsNumber = async () => {
    if (error) return;

    try {
      await createAddress({ type, value: smsNumber });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const deleteSmsNumber = async () => {
    try {
      await deleteAddress({ type });
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const resendSmsVerificationCode = async () => {
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
        <span className="dt-opacity-40">🔗 Phone number submitted</span>
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
          onClick={deleteSmsNumber}
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
      placeholder="+15554443333 (+1 required, US only)"
      type="sms"
      value={smsNumber}
      onChange={(e) => setSmsNumber(e.target.value)}
      onBlur={(e) =>
        e.target.checkValidity()
          ? setError(null)
          : setError({
              name: 'incorrectSmsNumber',
              message: 'Please enter a valid SMS number',
            })
      }
      onInvalid={(e) => {
        e.preventDefault();
        setError({
          name: 'incorrectSmsNumber',
          message: 'Please enter a valid SMS number',
        });
      }}
      // pattern="^\S+@\S+\.\S+$"
      disabled={isSmsNumberSaved && !isSmsNumberEditing}
    />
  );

  return (
    <div>
      <ToggleSection
        className="dt-mb-6"
        title="📶  SMS notifications"
        onChange={async (nextValue) => {
          setError(null);
          if (smsAddress && smsAddress.enabled !== nextValue) {
            await toggleAddress({
              type,
              enabled: nextValue,
            });
          }
        }}
        enabled={Boolean(smsAddress?.enabled)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="dt-flex dt-flex-col dt-space-y-2 dt-mb-2">
            <div className="">
              {isSmsNumberSaved && !isSmsNumberEditing ? (
                <>
                  {isVerified
                    ? renderVerifiedState()
                    : renderVerificationCode()}
                </>
              ) : null}
              {(!isSmsNumberSaved && isSmsNumberEditing) || isChanging
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

            {/* 1. If the phone number wasn't submitted yet */}
            {!isChanging && isSmsNumberEditing ? (
              <Button
                className="dt-basis-full"
                disabled={smsNumber === ''}
                onClick={saveSmsNumber}
                loading={isCreatingAddress}
              >
                {isCreatingAddress ? 'Saving...' : 'Submit number'}
              </Button>
            ) : null}

            {/* 2. If phone number already submited and user clicked "Change" */}
            {/* FIXME: this state enabled right after first email submition */}
            {isChanging && isVerified ? (
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
                  loading={isUpdatingAddress}
                >
                  {isUpdatingAddress ? 'Saving...' : 'Submit number'}
                </Button>
              </div>
            ) : null}

            {/* 3. User submitted a phone number and now promted to verification */}
            {!isSmsNumberEditing && !isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <div
                  className={clsx(
                    textStyles.small,
                    'display: inline-flex',
                    'dt-mb-1'
                  )}
                  onClick={resendSmsVerificationCode}
                >
                  <span className="dt-opacity-50">
                    {' '}
                    Check {smsAddress?.value || 'your phone'} for a verification
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

            {/* 4. User submitted and verified a phone number, and there's no user interaction yet */}
            {!isSmsNumberEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setSmsNumberEditing(true)}
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
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </P>
          ) : null}
          {!currentError && isChanging ? (
            <P className={clsx(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your SMS number is a global setting across
              all dapps. You will be prompted to sign with your wallet, this
              action is free.
            </P>
          ) : null}
        </form>
      </ToggleSection>
    </div>
  );
}
