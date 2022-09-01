import clsx from 'clsx';
import { Centered, Loader } from '../components/common';
import { H3 } from '../components/common/preflighted';
import { useTheme } from '../components/common/providers/DialectThemeProvider';

const LoadingThread = () => {
  const { textStyles } = useTheme();
  return (
    <Centered>
      <H3
        className={clsx(textStyles.header, 'dt-flex dt-items-center dt-mb-1')}
      >
        <Loader className="dt-mr-2" /> Loading notifications settings
      </H3>
    </Centered>
  );
};

export default LoadingThread;
