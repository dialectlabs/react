import clsx from 'clsx';
import { ClassTokens, Icons } from '../theme';
import { IconButton } from './primitives';

interface HeaderProps {
  title: string;
  showBackButton: boolean;
  showSettingsButton: boolean;
  showCloseButton: boolean;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  onCloseClick?: () => void;
}

export function Header({
  title,
  showCloseButton = true,
  showSettingsButton = true,
  showBackButton = true,
  onSettingsClick,
  onBackClick,
  onCloseClick,
}: HeaderProps) {
  const BackButton = () => (
    <IconButton
      className={ClassTokens.Icon.Secondary}
      onClick={onBackClick}
      icon={<Icons.ArrowLeft />}
    />
  );

  const SettingsButton = () => (
    <IconButton
      className={ClassTokens.Icon.Secondary}
      onClick={onSettingsClick}
      icon={<Icons.Settings />}
    />
  );

  const CloseButton = () => (
    <IconButton
      className={ClassTokens.Icon.Secondary}
      onClick={onCloseClick}
      icon={<Icons.Close />}
    />
  );

  const leftButtons = <>{showBackButton && <BackButton />}</>;

  const rightButtons = (
    <div className="dt-flex dt-gap-3">
      {showSettingsButton && <SettingsButton />}
      {showCloseButton && <CloseButton />}
    </div>
  );

  return (
    <div
      className={clsx(
        ClassTokens.Background.Secondary,
        'dt-flex dt-flex-row dt-items-center dt-justify-between dt-gap-4 dt-px-4 dt-py-4',
      )}
    >
      <div className="dt-flex dt-flex-row dt-items-center dt-gap-2">
        {leftButtons}
        <span
          className={clsx(ClassTokens.Text.Primary, 'dt-text-h2 dt-font-bold')}
        >
          {title}
        </span>
      </div>
      {rightButtons}
    </div>
  );
}
