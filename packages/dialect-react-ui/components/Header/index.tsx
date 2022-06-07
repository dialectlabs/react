import IconButton from '../IconButton';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';
import { H3 } from '../common/preflighted';
import { createContext, useContext } from 'react';

interface HeaderProps {
  inbox?: boolean;
  onHeaderClick?: () => void;
  onClose?: () => void;
  children?: ReactNode | ReactNode[];
}

interface IconProps extends ComponentProps<typeof IconButton> {
  children?: ReactNode;
}

interface IconsProps {
  containerOnly?: boolean;
  children?: ReactNode | ReactNode[];
  position?: 'left' | 'right';
}

interface TitleProps {
  stretch?: boolean;
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
}

const HeaderContext = createContext<{
  inbox?: boolean;
  onClose?: () => void;
} | null>(null);

const useHeader = () => {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeader must be used inside HeaderProvider');
  }

  return context;
};

export const Header = ({
  inbox,
  children,
  onHeaderClick,
  onClose,
}: HeaderProps) => {
  const { header } = useTheme();

  return (
    <HeaderContext.Provider value={{ inbox, onClose }}>
      <header
        className={clsx(
          'dt-max-h-[3.5rem] dt-min-h-[3.5rem] dt-px-2 dt-h-full dt-flex dt-justify-between dt-items-center dt-border-b dt-border-neutral-900',
          header
        )}
        onClick={onHeaderClick}
      >
        {children}
      </header>
    </HeaderContext.Provider>
  );
};

Header.Icon = function HeaderIcon({
  children,
  className,
  ...iconButtonProps
}: IconProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <IconButton
      {...iconButtonProps}
      className={clsx('not:first:dt-ml-3', className)}
    />
  );
};

Header.Icons = function HeaderIconsContent({
  children,
  position = 'right',
  containerOnly = false,
}: IconsProps) {
  const { inbox, onClose } = useHeader();
  const { icons } = useTheme();

  return (
    <div
      className={clsx('dt-flex', {
        'dt-pr-3': position === 'left',
        'dt-pl-3': position === 'right',
      })}
    >
      {children}
      {!containerOnly && !inbox && onClose && (
        <div className="sm:dt-hidden not:first:dt-ml-3">
          <IconButton icon={<icons.x />} onClick={onClose} />
        </div>
      )}
    </div>
  );
};

Header.Title = function HeaderTitle({
  children = 'Messages',
  stretch = true,
  align = 'left',
}: TitleProps) {
  const { textStyles } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex',
        {
          'dt-flex-1': stretch,
        },
        {
          'dt-justify-center': align === 'center',
          'dt-justify-start': align === 'left',
          'dt-justify-end': align === 'right',
        }
      )}
    >
      {typeof children === 'string' ? (
        <H3 className={clsx(textStyles.header)}>{children}</H3>
      ) : (
        children
      )}
    </div>
  );
};
