import {
  AddressType,
  useDapp,
  useDialectSdk,
  useNotificationChannel,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Button, Input } from '../../../core/primitives';
import { ClassTokens, Icons } from '../../../theme';
import { TelegramHandleInput } from './TelegramHandleInput';
import { useVerificationCode } from './model/useVerificationCode';

const ADDRESS_TYPE = AddressType.Telegram;

interface TelegramProps {
  dappAddress: string;
}
export const TelegramChannel = ({ dappAddress }: TelegramProps) => {
  const { globalAddress: telegramAddress } = useNotificationChannel({
    addressType: AddressType.Telegram,
  });
  const isTelegramSaved = Boolean(telegramAddress);
  const isVerified = Boolean(telegramAddress?.verified);

  const { dapps } = useDapp({ verified: false });
  const dapp = dapps[dappAddress];

  return (
    <div>
      {isTelegramSaved && !isVerified ? (
        <VerificationCodeInput
          dappTelegramName={dapp?.telegramUsername ?? ''}
        />
      ) : (
        <TelegramHandleInput dappAddress={dappAddress} />
      )}
    </div>
  );
};
const VERIFICATION_CODE_REGEX = '^[0-9]{6}$';
const VerificationCodeInput = ({
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
  } = useVerificationCode(ADDRESS_TYPE);

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

  return (
    //TODO check by regex
    <div>
      <Input
        id="settings-verification-code"
        placeholder="Enter verification code"
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        pattern={VERIFICATION_CODE_REGEX}
        rightAdornment={
          <Button onClick={sendCode} loading={isSendingCode}>
            Submit
          </Button>
        }
      />
      <a
        className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}
        href={botURL}
        target="_blank"
        rel="noreferrer"
      >
        🤖 Get verification code by starting
        <span className={ClassTokens.Text.Brand}> this bot</span>
        with command: /start
      </a>
      <span
        onClick={deleteAddress}
        className="dt-inline-flex dt-cursor-pointer dt-items-center"
      >
        <Icons.Close
          className={clsx('dt-mb-0.5 dt-mr-0.5 dt-inline-block')}
          height={14}
          width={14}
        />
        Cancel
      </span>
      {currentError && (
        <p className={clsx(ClassTokens.Text.Error, 'dt-mt-2 dt-text-caption')}>
          {currentError.message}
        </p>
      )}
    </div>
  );
};
