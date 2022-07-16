import { useDialectDapp, useThread } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { Divider } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useRoute } from '../common/providers/Router';
import IconButton from '../IconButton';
import { RouteName } from './constants';

function Header(props: {
  isReady: boolean;
  isWeb3Enabled: boolean;
  onModalClose: () => void;
  onBackClick?: () => void;
}) {
  const { navigate, current } = useRoute();
  const { colors, textStyles, header, icons } = useTheme();
  const isSettingsOpen = current?.name === RouteName.Settings;
  const { dappAddress } = useDialectDapp();
  const { thread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });
  const openSettings = () => {
    navigate(RouteName.Settings);
  };
  const openThread = () => {
    if (!thread) return;
    navigate(RouteName.Thread, {
      params: { threadId: thread.id },
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
        <div className="sm:dt-hidden dt-ml-3">
          <CloseButton />
        </div>
      </div>
    </>
  );

  // Support for threads created before address registry launch
  if (!props.isWeb3Enabled) {
    return (
      <>
        <div
          className={clsx(
            'dt-flex dt-flex-row dt-items-center dt-justify-between',
            header
          )}
        >
          <div className="dt-flex dt-items-center">
            <MasterBackButton />
            <span className={clsx(textStyles.header, colors.accent)}>
              Setup Notifications
            </span>
          </div>
          {headerIcons}
        </div>
        <Divider />
      </>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'dt-flex dt-flex-row dt-items-center dt-justify-between',
          header
        )}
      >
        {!isSettingsOpen ? (
          <>
            <MasterBackButton />
            <span className={clsx(textStyles.header, colors.accent)}>
              Notifications
            </span>
          </>
        ) : (
          <div className="dt-flex dt-flex-row dt-items-center">
            <BackButton />
            <span className={clsx(textStyles.header, colors.accent)}>
              Settings
            </span>
          </div>
        )}
        {headerIcons}
      </div>
      <Divider />
    </>
  );
}

export default Header;
