import React, { useEffect, useState } from 'react';
import { useApi, AddressType, ParsedErrorData } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { Button, Toggle, ValueRow } from '../common';
import { DialectErrors } from '@dialectlabs/react';
import { P } from '../common/preflighted';

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
    secondaryRemoveButton,
    highlighted,
  } = useTheme();

  const [email, setEmail] = useState(emailObj?.value);
  const [isEnabled, setEnabled] = useState(Boolean(emailObj?.enabled));
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
    setEnabled(Boolean(emailObj?.enabled));
    setEmail(emailObj?.value || '');
    setEmailEditing(!emailObj?.enabled);
  }, [emailObj]);

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
                <div
                  className={cs(highlighted, textStyles.body, colors.highlight)}
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
                  className="dt-basis-1/2"
                  onClick={() => {
                    setEmailEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="dt-basis-1/2"
                  disabled={email === ''}
                  onClick={async () => {
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
                  }}
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
                onClick={async () => {
                  if (emailError) return;

                  await saveAddress(wallet, {
                    type: 'email',
                    value: email,
                    enabled: true,
                  });
                }}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit email'}
              </Button>
            ) : null}

            {!isEmailEditing ? (
              <div className="dt-flex dt-flex-row dt-space-x-2">
                <Button
                  className="dt-basis-1/2"
                  onClick={async () => {
                    setEmailEditing(true);
                  }}
                  loading={isSavingAddress}
                >
                  Change email
                </Button>
                <Button
                  className="dt-basis-1/2"
                  defaultStyle={secondaryRemoveButton}
                  onClick={async () => {
                    await deleteAddress(wallet, {
                      addressId: emailObj?.addressId,
                    });
                  }}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete email'}
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && !isChanging && isEmailEditing ? (
            <p className={cs(textStyles.small, 'dt-mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </p>
          ) : null}
          {!currentError && isChanging ? (
            <p className={cs(textStyles.small, 'dt-mb-1')}>
              ⚠️ Changing or deleting your email is a global setting across all
              dapps. You will be prompted to sign with your wallet, this action
              is free.
            </p>
          ) : null}
          {!currentError && !isEmailEditing && isVerified ? (
            <p className={cs(textStyles.small, 'dt-mb-1')}>
              You can now chill and receive all the events directly to your
              inbox.
            </p>
          ) : null}
        </form>
      )}
      {currentError && (
        <p className={cs(textStyles.small, 'dt-text-red-500 dt-mt-2')}>
          {currentError.message}
        </p>
      )}
    </div>
  );
}
