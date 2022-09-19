import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import IconButton from '../IconButton';

interface HeaderProps {
  onModalClose?: () => void;
}

export const Header = (props: HeaderProps) => {
  const { colors, textStyles, header, notificationHeader, icons } = useTheme();

  const CloseButton = () => (
    <IconButton icon={<icons.x />} onClick={props.onModalClose} />
  );

  const headerIcons = (
    <>
      <div className="dt-flex">
        <div className={clsx('sm:dt-hidden', 'dt-ml-3')}>
          <CloseButton />
        </div>
      </div>
    </>
  );

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-items-center dt-justify-between',
        header,
        notificationHeader
      )}
    >
      <span className={clsx(textStyles.header, colors.accent)}>
        Notifications
      </span>
      {headerIcons}
    </div>
  );
};
