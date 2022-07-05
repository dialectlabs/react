import clsx from 'clsx';
import { Centered, Loader } from '../../components/common';
import { H3, P } from '../../components/common/preflighted';
import { useTheme } from '../../components/common/providers/DialectThemeProvider';

const SignMessageInfo = () => {
  const { textStyles } = useTheme();
  return (
    <Centered>
      <H3
        className={clsx(textStyles.header, 'dt-flex dt-items-center dt-mb-1')}
      >
        <Loader className="dt-mr-2" /> Waiting for your wallet
      </H3>
      <P className="dt-text-center dt-max-w-sm dt-opacity-50">
        To continue please prove you own a wallet by approving signing request.
        It is free and does not involve the network.
      </P>
    </Centered>
  );
};

export default SignMessageInfo;
