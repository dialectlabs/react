import React from 'react';
import {
  Gear,
  NotConnected,
  NoNotifications,
  DialectLogo as Dialect,
  BackArrow,
  Trash,
  Spinner,
} from './icons/';

type IconPropsType = {
  className?: string;
};

// TODO: do we need this, since we already have svgr generated icons
export function GearIcon(props: IconPropsType): JSX.Element {
  return <Gear {...props} />;
}

export function NotConnectedIcon(props: IconPropsType): JSX.Element {
  return <NotConnected {...props} />;
}

export function NoNotificationsIcon(props: IconPropsType): JSX.Element {
  return <NoNotifications {...props} />;
}

export function BackArrowIcon(props: IconPropsType): JSX.Element {
  return <BackArrow {...props} />;
}

export function TrashIcon(props: IconPropsType): JSX.Element {
  return <Trash {...props} />;
}

export function DialectLogo(props: IconPropsType): JSX.Element {
  return <Dialect {...props} />;
}

export function SpinnerIcon(props: IconPropsType): JSX.Element {
  return <Spinner {...props} />;
}
