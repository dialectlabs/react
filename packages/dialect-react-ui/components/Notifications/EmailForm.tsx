import React, { useEffect, useRef, useState } from 'react';
import { AddressType, saveAddress, useApi } from '@dialectlabs/react';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import { Button, ValueRow } from '../common';

function getEmailObj(addresses = []): AddressType | null {
  return addresses.find((address) => address.type === 'email') || null;
}

export function EmailForm() {
  const dapp = 'dialect';
  const {
    wallet,
    addresses,
    isSavingAddress,
    deleteAddress,
    isDeletingAddress,
  } = useApi();
  const emailObj = getEmailObj(addresses);

  const { textStyles, outlinedInput } = useTheme();

  const [isEnabled, setEnabled] = useState(emailObj?.enabled);

  const [email, setEmail] = useState(emailObj?.value);
  const [isEmailSaved, setEmailSaved] = useState(Boolean(emailObj));
  const [isEmailEditing, setEmailEditing] = useState(!emailObj?.enabled);
  const [emailError, setEmailError] = useState('');

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
        <input
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
                      ? setEmailError('')
                      : setEmailError('Please enter correct email')
                  }
                  onInvalid={(e) => {
                    e.preventDefault();
                    setEmailError('Please enter correct email');
                  }}
                  disabled={isEmailSaved && !isEmailEditing}
                />
              )}
            </div>

            {isEmailEditing ? (
              <Button
                className="basis-full"
                disabled={email === ''}
                onClick={async () => {
                  // TODO: validate & save email
                  if (emailError) return;

                  await saveAddress(wallet?.publicKey, dapp, {
                    type: 'email',
                    value: email,
                    enabled: true,
                  });

                  setEmailSaved(true);
                  setEmailEditing(false);
                }}
                loading={isSavingAddress}
              >
                {isSavingAddress ? 'Saving...' : 'Submit'}
              </Button>
            ) : (
              <div className="flex flex-row space-x-2">
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    setEmailEditing(true);
                  }}
                  loading={isSavingAddress}
                >
                  Edit
                </Button>
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    await deleteAddress(wallet?.publicKey, {
                      addressId: emailObj?.addressId,
                    });

                    setEnabled(false);
                    setEmail('');
                  }}
                  loading={isDeletingAddress}
                >
                  {isDeletingAddress ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>
          {emailError ? (
            <p className={cs(textStyles.small, 'text-red-500 mt-2')}>
              {emailError}
            </p>
          ) : null}
          {!emailError && isEmailEditing ? (
            <p className={cs(textStyles.small, 'mb-1')}>
              You will be prompted to sign with your wallet, this action is
              free.
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
