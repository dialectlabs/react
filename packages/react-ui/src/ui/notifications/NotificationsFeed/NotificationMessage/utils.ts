import { NotificationStyleToggleColor } from '../../../../types';

export const getMessageURLTarget = (url: string) => {
  const urlObj = new URL(url);

  if (urlObj.hostname === window.location.hostname) {
    return '_self';
  }

  return '_blank';
};

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const getColor = (
  color?: string | NotificationStyleToggleColor,
  theme?: 'light' | 'dark',
): string | undefined => {
  if (!color) {
    return;
  }

  if (typeof color === 'string') {
    return color;
  }

  return color[theme || 'light'];
};
