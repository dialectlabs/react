import { useTheme } from '../common/ThemeProvider';
import React, { useState } from 'react';
import cs from '../../utils/classNames';
import { Button, ValueRow } from '../common';

export function EmailForm() {
  const { textStyles, outlinedInput } = useTheme();

  const [isEnabled, setEnabled] = useState(false);

  const [email, setEmail] = useState('');
  const [isEmailSaving, setEmailSaving] = useState(false);
  const [isEmailSaved, setEmailSaved] = useState(false);
  const [isEmailEditing, setEmailEditing] = useState(true);
  const [isEmailDeleting, setEmailDeleting] = useState(false);
  const [emailError, setEmailError] = useState('');

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
            </div>

            {isEmailEditing ? (
              <Button
                className="basis-full"
                disabled={email === ''}
                onClick={async () => {
                  // TODO: validate & save email
                  if (emailError) return;

                  setEmailSaving(true);
                  setTimeout(() => {
                    setEmailSaving(false);
                    setEmailSaved(true);
                    setEmailEditing(false);
                    setEmailDeleting(false);
                  }, 2000);
                }}
                loading={isEmailSaving}
              >
                {isEmailSaving ? 'Saving...' : 'Submit'}
              </Button>
            ) : (
              <div className="flex flex-row space-x-2">
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    setEmailEditing(true);
                  }}
                  loading={isEmailSaving}
                >
                  Edit
                </Button>
                <Button
                  className="basis-1/2"
                  onClick={async () => {
                    // TODO: delete email association
                    setEmailDeleting(true);
                    setTimeout(() => {
                      setEmail('');
                      setEmailSaved(false);
                      setEmailEditing(true);
                      setEmailDeleting(false);
                    }, 2000);
                  }}
                  loading={isEmailDeleting}
                >
                  {isEmailDeleting ? 'Deleting...' : 'Delete'}
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
