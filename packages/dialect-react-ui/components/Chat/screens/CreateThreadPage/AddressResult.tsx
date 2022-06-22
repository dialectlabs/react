import clsx from 'clsx';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

const AddressResult = ({
  valid,
  address,
  isTwitterHandle,
  isSNS,
  isYou,
  twitterHandle,
  snsDomain,
}: {
  valid: boolean;
  address?: string;
  isYou: boolean;
  isTwitterHandle: boolean;
  isSNS: boolean;
  twitterHandle: string | null;
  snsDomain: string | null;
}) => {
  const { textStyles } = useTheme();

  if (isYou) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Sorry, you couldn't message yourself currently
      </P>
    );
  }

  if (isTwitterHandle && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        No address is associated with this twitter handle
      </P>
    );
  }

  if (isSNS && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Couldn't find this SNS domain
      </P>
    );
  }

  if (!isTwitterHandle && !isSNS && !valid) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-1 dt-px-2')}>
        Invalid address, Twitter handle or SNS domain
      </P>
    );
  }

  // Valid states

  // TODO: isChecking
  if (valid && (isSNS || isTwitterHandle)) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        {address}
      </P>
    );
  }

  if (valid && twitterHandle && snsDomain) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        SNS domain: {snsDomain}.sol / Twitter handle: {twitterHandle}
      </P>
    );
  }

  if (valid && snsDomain) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        SNS domain: {snsDomain}.sol
      </P>
    );
  }

  if (valid && twitterHandle) {
    return (
      <P
        className={clsx(textStyles.small, 'dt-text-green-500 dt-mt-1 dt-px-2')}
      >
        Twitter handle: {twitterHandle}
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
