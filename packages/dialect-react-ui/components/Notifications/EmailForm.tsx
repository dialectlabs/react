import React, { useEffect, useState } from 'react';
import { useApi, DialectErrors, ParsedErrorData } from '@dialectlabs/react';
import type { AddressType } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { P } from '../common/preflighted';
import { Button, ToggleSection } from '../common';
import clsx from 'clsx';

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
    xPaddedText,
  } = useTheme();

  const [email, setEmail] = useState(emailObj?.value);
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [emailError, setEmailError] = useState<ParsedErrorData | null>(null);

  const isEmailSaved = Boolean(emailObj);
  const isChanging = emailObj && isEmailEditing;
  const isVerified = emailObj?.verified;

  const currentError =
    emailError ||
    fetchingAddressesError ||
    savingAddressError ||
    deletingAddressError;

  useEffect(() => {
    // Update state if addresses updated
    setEmail(emailObj?.value || '');
    setEmailEditing(!emailObj?.enabled);
  }, [emailObj]);

  const updateEmail = async () => {
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

  return (
    <>
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
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div
              className={clsx(
                'dt-flex dt-flex-col dt-mb-2',
                (!isEmailSaved || isEmailEditing) && 'dt-space-y-2'
              )}
            >
              <div className="">
                {isEmailSaved && !isEmailEditing ? (
                  <div
                    className={cs(
                      highlighted,
                      textStyles.body,
                      colors.highlight
                    )}
                  >
                    <span className="dt-opacity-40">🔗 Email submitted</span>
                  </div>
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

              {!isEmailEditing ? (
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
              <P className={cs(textStyles.small, xPaddedText, 'dt-mb-1')}>
                You will be prompted to sign with your wallet, this action is
                free.
              </P>
            ) : null}
            {!currentError && isChanging ? (
              <P className={cs(textStyles.small, xPaddedText, 'dt-mb-1')}>
                ⚠️ Changing or deleting your email is a global setting across
                all dapps. You will be prompted to sign with your wallet, this
                action is free.
              </P>
            ) : null}
            {!currentError && !isEmailEditing && isVerified ? (
              <P className={cs(textStyles.small, xPaddedText, 'dt-mb-1')}>
                🔗 Email verified, you should now receive notifications.
              </P>
            ) : null}
          </form>
        </div>
      </ToggleSection>
      {currentError && (
        <P
          className={cs(
            textStyles.small,
            xPaddedText,
            'dt-text-red-500 dt-mt-2'
          )}
        >
          {currentError.message}
        </P>
      )}
    </>
  );
}
