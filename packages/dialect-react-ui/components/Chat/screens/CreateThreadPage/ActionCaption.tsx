import { DialectSdkError, useDialectSdk } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

export default function ActionCaption({
  creationError,
  encrypted,
}: {
  encrypted: boolean;
  creationError: DialectSdkError | null;
}) {
  const { textStyles, xPaddedText } = useTheme();
  const {
    info: { apiAvailability },
  } = useDialectSdk();

  if (creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN') {
    return (
      <P
        className={clsx(
          textStyles.small,
          xPaddedText,
          'dt-text-red-500 dt-mt-2'
        )}
      >
        {creationError.message}
      </P>
    );
  }

  if (!apiAvailability.canEncrypt) {
    return (
      <P
        className={clsx(textStyles.small, xPaddedText, 'dt-text-left dt-mt-2')}
      >
        Use{' '}
        <A
          href="https://www.sollet.io/"
          target="_blank"
          className="dt-underline"
        >
          Sollet.io
        </A>{' '}
        wallet to send encrypted messages.
      </P>
    );
  }

  if (encrypted) {
    return (
      <P
        className={clsx(textStyles.small, xPaddedText, 'dt-text-left dt-mt-2')}
      >
        ⚠️ Sollet.io encryption standards in the browser are experimental. Do
        not connect a wallet with significant funds in it.
      </P>
    );
  }

  return null;
}
