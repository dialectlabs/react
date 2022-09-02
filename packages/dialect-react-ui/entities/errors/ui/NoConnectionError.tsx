import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

interface NoConnectionErrorProps {
  message?: string | JSX.Element;
}

const NoConnectionError = ({ message }: NoConnectionErrorProps) => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">{message}</span>
    </Centered>
  );
};

export default NoConnectionError;
