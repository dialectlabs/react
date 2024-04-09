import { useCallback, useState } from 'react';
import { Icons } from '../theme';
import { Notifications } from './Notifications';

export const NotificationsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="dt-relative">
      <button
        onClick={handleClick}
        className="dt-rounded-xl dt-bg-light-60 dt-p-3"
      >
        <Icons.BellButton />
      </button>
      {isOpen && (
        <div className="dt-absolute -dt-right-32 dt-top-14 dt-overflow-hidden dt-rounded-xl dt-bg-transparent dt-shadow-xl">
          {<Notifications />}
        </div>
      )}
    </div>
  );
};
