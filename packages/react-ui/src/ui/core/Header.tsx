import clsx from 'clsx';
import React from 'react';
import { ClassTokens, Icons } from '../theme';
import { IconButton } from './primitives';

interface HeaderProps {
  title: string;
  showBackButton: boolean;
  showClearNotificationsButton?: boolean;
  showSettingsButton: boolean;
  showCloseButton: boolean;
  onBackClick?: () => void;
  onClearNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onCloseClick?: () => void;
}

const BackButton: React.FC<{ onBackClick: HeaderProps['onBackClick'] }> = ({
  onBackClick,
}) => (
  <IconButton
    className={ClassTokens.Icon.Secondary}
    onClick={onBackClick}
    icon={<Icons.ArrowLeft />}
  />
);

const ClearNotificationsButton: React.FC<{ onClearNotificationsClick: HeaderProps['onClearNotificationsClick'] }> = ({
  onClearNotificationsClick,
}) => (
  <IconButton
    className={ClassTokens.Icon.Secondary}
    onClick={onClearNotificationsClick}
    icon={<Icons.Trash />}
  />
);

const SettingsButton: React.FC<{
  onSettingsClick: HeaderProps['onSettingsClick'];
}> = ({ onSettingsClick }) => (
  <IconButton
    className={ClassTokens.Icon.Secondary}
    onClick={onSettingsClick}
    icon={<Icons.Settings />}
  />
);

const CloseButton: React.FC<{
  onCloseClick: HeaderProps['onCloseClick'];
}> = ({ onCloseClick }) => (
  <IconButton
    className={ClassTokens.Icon.Secondary}
    onClick={onCloseClick}
    icon={<Icons.Close />}
  />
);

export function Header({
  title,
  showCloseButton = true,
  showSettingsButton = true,
  showBackButton = true,
  showClearNotificationsButton = false,
  onSettingsClick,
  onBackClick,
  onCloseClick,
  onClearNotificationsClick,
}: HeaderProps) {
  const leftButtons = (
    <>{showBackButton && <BackButton onBackClick={onBackClick} />}</>
  );

  const rightButtons = (
    <div className="dt-flex dt-gap-3">
      {showClearNotificationsButton && (
        <ClearNotificationsButton onClearNotificationsClick={onClearNotificationsClick} />
      )}
      {showSettingsButton && (
        <SettingsButton onSettingsClick={onSettingsClick} />
      )}
      {showCloseButton && <CloseButton onCloseClick={onCloseClick} />}
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
