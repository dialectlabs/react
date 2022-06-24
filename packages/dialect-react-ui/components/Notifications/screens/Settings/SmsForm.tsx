import { useDialectCloudApi } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Button, ToggleSection } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ResendIcon from '../../../Icon/Resend';

export function SmsForm() {
  const {
    addresses: { sms: smsObj },
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

  const [smsNumber, setSmsNumber] = useState(smsObj?.value);
  const [isSmsNumberEditing, setSmsNumberEditing] = useState(!smsObj?.enabled);
  const [error, setError] = useState<Error | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isSmsNumberSaved = Boolean(smsObj);
  const isChanging = smsObj && isSmsNumberEditing;
  const isVerified = smsObj?.verified;

  const currentError = error || fetchingAddressesError;

  useEffect(() => {
    // Update state if addresses updated
    setSmsNumber(smsObj?.value || '');
    setSmsNumberEditing(!smsObj?.enabled);
  }, [smsObj]);

  const updateSmsNumber = async () => {
    // TODO: validate & save sms number
    if (error) return;

    try {
      setLoading(true);
      await updateAddress({
        type: 'sms',
        value: smsNumber,
        enabled: true,
        id: smsObj?.id,
        addressId: smsObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      setSmsNumberEditing(false);
    }
  };

  const saveSmsNumber = async () => {
    if (error) return;

    try {
      setLoading(true);
      await saveAddress({
        type: 'sms',
        value: smsNumber,
        enabled: true,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSmsNumber = async () => {
    try {
      setLoading(true);
      await deleteAddress({
        addressId: smsObj?.addressId,
      });
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const resendSmsVerificationCode = async () => {
    try {
      setLoading(true);
      await resendCode({
        type: 'sms',
        value: smsNumber,
        enabled: true,
        id: smsObj?.id,
        addressId: smsObj?.addressId,
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
          type: 'sms',
          value: smsNumber,
          enabled: true,
          id: smsObj?.id,
          addressId: smsObj?.addressId,
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
          loading={loading}
        >
          {loading ? 'Sending code...' : 'Submit'}
        </Button>
        <Button
          className="dt-basis-1/4"
          onClick={deleteSmsNumber}
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
        title="📶  SMS notifications"
        onChange={async (nextValue) => {
          setError(null);
          if (smsObj && smsObj.enabled !== nextValue) {
            // TODO: handle error
            await updateAddress({
              id: smsObj.id,
              type: smsObj.type,
              enabled: nextValue,
            });
          }
        }}
        enabled={Boolean(smsObj?.enabled)}
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
              ) : (
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
                  onClick={() => setSmsNumberEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={smsNumber === ''}
                  onClick={updateSmsNumber}
                  loading={loading}
                >
                  {loading ? 'Saving...' : 'Submit number'}
                </Button>
              </div>
            )}

            {!isChanging && isSmsNumberEditing ? (
              <Button
                className="dt-basis-full"
                disabled={smsNumber === ''}
                onClick={saveSmsNumber}
                loading={loading}
              >
                {loading ? 'Saving...' : 'Submit number'}
              </Button>
            ) : null}

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
                    Check your phone for a verification code.
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

            {!isSmsNumberEditing && isVerified ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={() => setSmsNumberEditing(true)}
                  loading={loading}
                >
                  Change
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={deleteSmsNumber}
                  loading={loading}
                >
                  {loading ? 'Deleting...' : 'Delete number'}
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
