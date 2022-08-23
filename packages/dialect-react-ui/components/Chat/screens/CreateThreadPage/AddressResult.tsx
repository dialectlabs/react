import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

interface AddressResultProps {
  publicKey?: PublicKey | null;
  isYou?: boolean;
}

const AddressResult = ({ publicKey }: AddressResultProps) => {
  const { textStyles } = useTheme();

  if (!publicKey) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Invalid address
      </P>
    );
  }

  return (
    <P className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}>
      Valid address
    </P>
  );
};

export default AddressResult;
