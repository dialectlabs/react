import clsx from 'clsx';
import { ClassTokens, Icons } from '../theme';

interface HeaderProps {}

function Header(props: HeaderProps) {
  const title = 'Notifications';
  const showBackButton = true;
  const showSettingsButton = true;
  const showCloseButton = true;

  const BackButton = () => (
    <button>
      <Icons.ArrowLeft />
    </button>
  );

  const SettingsButton = () => (
    <button>
      <Icons.Settings />
    </button>
  );

  const CloseButton = () => (
    <button>
      <Icons.Close />
    </button>
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
        ClassTokens.Icon.Secondary,
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

export default Header;
