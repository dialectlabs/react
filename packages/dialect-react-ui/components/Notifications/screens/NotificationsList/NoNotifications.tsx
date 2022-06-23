import { Centered } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

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
