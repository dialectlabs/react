import { AddressType, useDialectSdk } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Button, Input, TextButton } from '../../../../core';
import { ClassTokens, Icons } from '../../../../theme';
import { useVerificationCode } from '../model/useVerificationCode';

const VERIFICATION_CODE_REGEX = new RegExp('^[0-9]{6}$');
export const TelegramVerificationCodeInput = ({
  dappTelegramName,
}: {
  dappTelegramName: string;
}) => {
  const {
    config: { environment },
  } = useDialectSdk();

  const {
    verificationCode,
    setVerificationCode,
    sendCode,
    isSendingCode,
    deleteAddress,
    currentError,
  } = useVerificationCode(AddressType.Telegram);

  const buildBotUrl = (botUsername: string) =>
    `https://t.me/${botUsername}?start=${botUsername}`;

  const defaultBotUrl =
    environment === 'production'
      ? buildBotUrl('DialectLabsBot')
      : buildBotUrl('DialectLabsDevBot');

  const botURL = useMemo(() => {
    if (!dappTelegramName) {
      return defaultBotUrl;
    }
    return buildBotUrl(dappTelegramName);
  }, [dappTelegramName, defaultBotUrl]);

  const isCodeValid = useMemo(
    () => VERIFICATION_CODE_REGEX.test(verificationCode),
    [verificationCode],
  );

  return (
    <div>
      <Input
        id="settings-verification-code-telegram"
        placeholder="Enter verification code"
        label="Telegram"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        rightAdornment={
          isSendingCode ? (
            <div className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}>
              <Icons.Loader />
            </div>
          ) : (
            <Button
              onClick={isCodeValid ? sendCode : undefined}
              disabled={!isCodeValid}
            >
              Submit
            </Button>
          )
        }
      />
      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}
      <div className="dt-mt-2 dt-flex dt-flex-col dt-gap-2">
        <a
          className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}
          href={botURL}
          target="_blank"
          rel="noreferrer"
        >
          Message<span className={ClassTokens.Text.Accent}> this bot </span>
          on Telegram to get your verification code.
        </a>
        <TextButton onClick={deleteAddress} disabled={isSendingCode}>
          <Icons.Xmark height={12} width={12} />
          Cancel
        </TextButton>
      </div>
    </div>
  );
};
