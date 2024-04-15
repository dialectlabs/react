'use client';

import { MoonIcon } from '@/icons/MoonIcon';
import { SunIcon } from '@/icons/SunIcon';
import { ThemeType } from '@dialectlabs/react-ui';
import { useCallback, useEffect } from 'react';

export const getInitialTheme = (): ThemeType => {
  return typeof window !== 'undefined'
    ? (window.localStorage.getItem('data-theme') as ThemeType) ?? 'light'
    : 'light';
};

export const ThemeSwitch = (props: {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}) => {
  const { theme, onThemeChange } = props;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('data-theme', theme);
  }, [theme]);

  const changeTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(nextTheme);
  }, [theme, onThemeChange]);

  const translation = theme === 'dark' ? 'translate-x-4' : 'translate-x-0';

  const icon = <>{theme === 'light' ? <SunIcon /> : <MoonIcon />}</>;

  return (
    <button onClick={changeTheme}>
      <span
        className={
          'inline-flex h-10 w-14 items-center rounded-full bg-[var(--themeSwitchBg)] p-1 transition-colors ease-in-out [&>*]:bg-[var(--background)]'
        }
      >
        <span
          className={
            'inline-flex h-8 w-8 transform items-center justify-center rounded-full transition-transform ease-in-out ' +
            translation
          }
        >
          {icon}
        </span>
      </span>
    </button>
  );
};
