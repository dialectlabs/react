import type { ThreadId } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useRoute } from '../common/providers/Router';
import IconButton from '../IconButton';
import { RouteName } from './constants';

interface HeaderProps {
  isReady: boolean;
  isWeb3Enabled: boolean;
  settingsOnly?: boolean;
  onModalClose: () => void;
  onBackClick?: () => void;
  threadId?: ThreadId;
}

function Header(props: HeaderProps) {
  const { navigate, current } = useRoute();
  const { colors, textStyles, icons, header, notificationHeader } = useTheme();
  const isSettingsOpen = current?.name === RouteName.Settings;
  const openSettings = () => {
    navigate(RouteName.Settings);
  };
  const openThread = () => {
    if (!props.threadId) return;
    navigate(RouteName.Thread, {
      params: { threadId: props.threadId },
    });
  };

  const BackButton = () => (
    <IconButton
      icon={<icons.back />}
      onClick={openThread}
      className="dt-mr-2 dt-py-1"
    />
  );

  const SettingsButton = () =>
    props.isReady && !isSettingsOpen ? (
      <IconButton icon={<icons.settings />} onClick={openSettings} />
    ) : null;

  const CloseButton = () => (
    <IconButton icon={<icons.x />} onClick={props.onModalClose} />
  );

  const MasterBackButton = () =>
    props.onBackClick ? (
      <IconButton
        icon={<icons.back />}
        onClick={props.onBackClick}
        className="dt-mr-2 dt-py-1"
      />
    ) : null;

  const headerIcons = (
    <>
      <div className="dt-flex">
        <SettingsButton />
        <div className={clsx(!props.settingsOnly && 'sm:dt-hidden', 'dt-ml-3')}>
          <CloseButton />
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={clsx(
          'dt-flex dt-flex-row dt-items-center dt-justify-between',
          header,
          notificationHeader
        )}
      >
        {isSettingsOpen ? (
          <div className="dt-flex dt-flex-row dt-items-center">
            {props.isWeb3Enabled && !props.settingsOnly && <BackButton />}
            {!props.isWeb3Enabled && <MasterBackButton />}
            <span className={clsx(textStyles.header, colors.accent)}>
              Settings
            </span>
          </div>
        ) : (
          <>
            <MasterBackButton />
            <span className={clsx(textStyles.header, colors.accent)}>
              Notifications
            </span>
          </>
        )}
        {headerIcons}
      </div>
    </>
  );
}

export default Header;
