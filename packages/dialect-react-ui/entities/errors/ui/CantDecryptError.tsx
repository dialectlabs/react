import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

const CantDecryptError = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.notConnected className="dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">Cannot decrypt messages</span>
    </Centered>
  );
};

export default CantDecryptError;
