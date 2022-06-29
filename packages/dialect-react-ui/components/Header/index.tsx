import IconButton from '../IconButton';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';
import { H3 } from '../common/preflighted';
import { createContext, useContext } from 'react';
import { noPropagateEvent } from '../../utils/events';

interface HeaderProps {
  type?: 'inbox' | 'popup' | 'vertical-slider';
  onHeaderClick?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  children?: ReactNode | ReactNode[];
  isWindowOpen?: boolean;
}

interface IconProps extends ComponentProps<typeof IconButton> {
  children?: ReactNode;
}

interface IconsProps {
  containerOnly?: boolean;
  children?: ReactNode | ReactNode[];
  position?: 'left' | 'right';
  className?: string;
}

interface TitleProps {
  stretch?: boolean;
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
}

const HeaderContext = createContext<{
  type?: 'inbox' | 'popup' | 'vertical-slider';
  isWindowOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
} | null>(null);

const useHeader = () => {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeader must be used inside HeaderProvider');
  }

  return context;
};

// TODO: Make Header more agnostic (so that can be used in Notifications as well)
export const Header = ({
  type,
  children,
  onHeaderClick,
  onClose,
  onOpen,
  isWindowOpen,
}: HeaderProps) => {
  const { header } = useTheme();

  return (
    <HeaderContext.Provider value={{ type, onClose, onOpen, isWindowOpen }}>
      <header
        className={clsx(
          'dt-h-full dt-flex dt-justify-between dt-items-center dt-border-b dt-border-neutral-900',
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
  onClick,
  ...iconButtonProps
}: IconProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <IconButton
      {...iconButtonProps}
      onClick={onClick}
      className={clsx('dt-ml-3 first:dt-ml-0', className)}
    />
  );
};

Header.Icons = function HeaderIconsContent({
  children,
  position = 'right',
  containerOnly = false,
  className,
}: IconsProps) {
  const { type, onClose, onOpen, isWindowOpen } = useHeader();
  const { icons } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex',
        {
          'dt-pr-3': position === 'left',
          'dt-pl-3': position === 'right',
        },
        className
      )}
    >
      {children}
      {!containerOnly && type === 'vertical-slider' && onClose && onOpen && (
        <Header.Icon
          className={clsx('dt-transition-transform dt-rotate-0', {
            'dt-rotate-180': !isWindowOpen,
          })}
          icon={<icons.arrowvertical />}
          onClick={noPropagateEvent(isWindowOpen ? onClose : onOpen)}
        />
      )}
      {!containerOnly && type === 'popup' && onClose && (
        <Header.Icon
          className="sm:dt-hidden"
          icon={<icons.x />}
          onClick={onClose}
        />
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
        <H3
          className={clsx(textStyles.header, {
            'dt-text-center': align === 'center',
            'dt-text-left': align === 'left',
            'dt-text-right': align === 'right',
          })}
        >
          {children}
        </H3>
      ) : (
        children
      )}
    </div>
  );
};
