import { useCallback } from 'react';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName } from '../../constants';
import { useChatInternal } from '../../provider';

const NoMessages = () => {
  const { icons } = useTheme();
  const { type } = useChatInternal();
  const { navigate } = useRoute();
  const inbox = type === 'inbox';

  const navigateToCreateThread = useCallback(
    () =>
      navigate(RouteName.Main, {
        sub: { name: MainRouteName.CreateThread },
      }),
    [navigate]
  );

  if (!inbox) {
    return null;
  }
  return (
    <div className="dt-hidden md:dt-flex dt-flex-1 dt-justify-center dt-items-center">
      {/* TODO: replace with Button to be sematic */}
      <div
        className="dt-flex dt-cursor-pointer dt-opacity-30"
        onClick={navigateToCreateThread}
      >
        <icons.compose className="dt-mr-2" />
        <P>Send a new message</P>
      </div>
    </div>
  );
};

export default NoMessages;
