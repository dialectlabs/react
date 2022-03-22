import React, { useEffect, useState } from 'react';
import { useApi, AddressType, ParsedErrorData } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { Button, Toggle, ValueRow } from '../common';

function getEmailObj(addresses = []): AddressType | null {
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

  const { textStyles, outlinedInput } = useTheme();

  const [isEnabled, setEnabled] = useState(emailObj?.enabled);

  const [email, setEmail] = useState(emailObj?.value);
  const [isEmailSaved, setEmailSaved] = useState(Boolean(emailObj));
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [emailError, setEmailError] = useState<ParsedErrorData | null>(null);

  const isChanging = emailObj && isEmailEditing;

  const currentError =
    emailError ||
    fetchingAddressesError ||
    savingAddressError ||
    deletingAddressError;

  useEffect(() => {
    // Update state if addresses updated
    setEnabled(emailObj?.enabled);
    setEmail(emailObj?.value || '');
    setEmailEditing(!emailObj?.enabled);
    setEmailSaved(Boolean(emailObj));
  }, [emailObj]);

  return (
    <div>
      <ValueRow
        className="mb-2"
        label="I want to receive email notifications for this Dapp"
      >
        <Toggle
          type="checkbox"
          checked={isEnabled}
          onClick={() => setEnabled((prev) => !prev)}
        />
      </ValueRow>
      {isEnabled && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col space-y-2 mb-2">
            <div className="">
              {isEmailSaved && !isEmailEditing ? (
                <ValueRow>
                  Email submitted, now you need to verify it. Check your inbox.
                </ValueRow>
              ) : (
                <input
                  className={cs(outlinedInput, 'w-full basis-full')}
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) =>
                    e.target.checkValidity()
                      ? setEmailError(null)
                      : setEmailError({
                          type: 'INCORRECT_EMAIL',
                          message: 'Please enter correct email',
                        })
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setEmailError({
                      type: 'INCORRECT_EMAIL',
                      message: 'Please enter correct email',
                    });
                  }}
                  disabled={isEmailSaved && !isEmailEditing}
                />
              )}
            </div>

            {isChanging && (
              <div className="flex flex-row space-x-2">
                <Button
                  className="basis-1/2"
                  onClick={() => {
                    setEmailEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className={'basis-1/2'}
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

                    setEmailSaved(true);
                    setEmailEditing(false);
                  }}
                  loading={isSavingAddress}
                >
                  {isSavingAddress ? 'Changing...' : 'Change email'}
                </Button>
              </div>
            )}

            {!isChanging && isEmailEditing ? (
              <Button
                className={'basis-full'}
                disabled={email === ''}
                onClick={async () => {
                  // TODO: validate & save email
                  if (emailError) return;

                  await saveAddress(wallet, {
                    type: 'email',
                    value: email,
                    enabled: true,
                  });

                  setEmailSaved(true);
                  setEmailEditing(false);
                }}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit email'}
              </Button>
            ) : null}

            {!isEmailEditing ? (
              <div className="flex flex-row space-x-2">
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    await deleteAddress(wallet, {
                      addressId: emailObj?.addressId,
                    });

                    setEnabled(false);
                    setEmail('');
                  }}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete email'}
                </Button>
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    setEmailEditing(true);
                  }}
                  loading={isSavingAddress}
                >
                  Change
                </Button>
              </div>
            ) : null}
          </div>
          {!currentError && isEmailEditing ? (
            <p className={cs(textStyles.small, 'mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </p>
          ) : null}
        </form>
      )}
      {currentError && (
        <p className={cs(textStyles.small, 'text-red-500 mt-2')}>
          {currentError.message}
        </p>
      )}
    </div>
  );
}
