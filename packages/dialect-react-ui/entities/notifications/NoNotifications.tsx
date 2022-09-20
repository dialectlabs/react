import { Centered } from '../../components/common';
import { useTheme } from '../../components/common/providers/DialectThemeProvider';

const NoNotifications = () => {
  const { icons } = useTheme();
  return (
    <Centered>
      <icons.noNotifications className="dt-mb-6" />
      {/* TODO: use some textstyle */}
      <span className="dt-opacity-60">No notifications yet</span>
    </Centered>
  );
};

export default NoNotifications;
