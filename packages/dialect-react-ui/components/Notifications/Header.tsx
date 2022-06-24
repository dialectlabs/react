import clsx from 'clsx';
import { Divider } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import IconButton from '../IconButton';

function Header(props: {
  isReady: boolean;
  isWeb3Enabled: boolean;
  isSettingsOpen: boolean;
  onModalClose: () => void;
  toggleSettings: () => void;
  onBackClick?: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();

  const BackButton = () =>
    props?.onBackClick != null ? (
      <span className="pt-1 mr-1">
        <IconButton icon={<icons.back />} onClick={props.onBackClick} />
      </span>
    ) : null;

  // Support for threads created before address registry launch
  if (!props.isWeb3Enabled) {
    return (
      <>
        <div
          className={clsx(
            'dt-flex dt-flex-row dt-items-center dt-justify-items-start',
            header
          )}
        >
          <BackButton />
          <span className={clsx(textStyles.header, colors.accent)}>
            Setup Notifications
          </span>
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
        {!props.isSettingsOpen ? (
          <>
            <BackButton />
            <span className={clsx(textStyles.header, colors.accent)}>
              Notifications
            </span>
          </>
        ) : (
          <div className="dt-flex dt-flex-row dt-items-center">
            <IconButton
              icon={<icons.back />}
              onClick={props.toggleSettings}
              className="dt-mr-2 dt-py-1"
            />
            <span className={clsx(textStyles.header, colors.accent)}>
              Settings
            </span>
          </div>
        )}
        <div className="dt-flex">
          {props.isReady && !props.isSettingsOpen ? (
            <IconButton
              icon={<icons.settings />}
              onClick={props.toggleSettings}
            />
          ) : null}
          <div className="sm:dt-hidden dt-ml-3">
            <IconButton icon={<icons.x />} onClick={props.onModalClose} />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default Header;
