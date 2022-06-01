import IconButton from '../IconButton';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';

interface HeaderProps {
  title?: string;
  inbox?: boolean;
  onHeaderClick?: () => void;
  onClose?: () => void;
  children?: ReactNode | ReactNode[];
}

interface IconProps extends ComponentProps<typeof IconButton> {
  children?: ReactNode;
}

export const Header = ({
  title = 'Messages',
  inbox,
  children,
  onHeaderClick,
  onClose,
}: HeaderProps) => {
  const { icons, header } = useTheme();

  return (
    <div
      className={clsx(
        'dt-px-2 dt-pt-2 dt-pb-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold',
        header
      )}
    >
      <div className="dt-flex-1" onClick={onHeaderClick}>
        {title}
      </div>
      <div className="dt-flex">
        {children}
        {!inbox && onClose && (
          <div className="sm:dt-hidden dt-ml-3">
            <IconButton icon={<icons.x />} onClick={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

Header.Icon = function HeaderIcon({ children, ...iconButtonProps }: IconProps) {
  if (children) {
    return <>{children}</>;
  }

  return <IconButton {...iconButtonProps} />;
};
