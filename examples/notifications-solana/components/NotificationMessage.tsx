import { Primitives, ThreadMessage } from '@dialectlabs/react-ui';
import { useSmartMessage } from '../_wip_actions_poc/hooks/useSmartMessage';

export const DIALECT_ID = 'dialect-notifications';

const defaultMessageStyles = {
  shadow: 'shadow-purple-60',
  iconBackground: 'bg-purple-50',
  icon: null,
  link: 'text-purple-50',
  title: '',
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
export const NotificationMessage = (message: ThreadMessage) => {
  const { handleSmartMessageAction } = useSmartMessage();
  const smartMessage = message.metadata?.smartMessage;

  //'announcement' or 'filled-order'
  const messageStyles =
    message.metadata?.notificationTypeHumanReadableId === 'filled-order'
      ? {
          shadow: 'shadow-green-50',
          iconBackground: 'bg-green-50',
          link: 'text-green-50',
          icon: null,
          title: 'text-green-50',
        }
      : defaultMessageStyles;

  const renderIcon = () => {
    // TODO: update after design is ready
    const smartMessageIcon = smartMessage?.content.layout.icon;
    if (!smartMessageIcon) {
      return messageStyles.icon;
    }
    return <Primitives.Img src={smartMessageIcon} />;
  };

  function renderMessage() {
    return (
      <div className="min-w-0">
        {message.metadata?.title && (
          <div
            className={
              'header text-body-01-medium font-semibold break-words whitespace-pre-wrap pb-2 ' +
              messageStyles.title
            }
          >
            {message.metadata.title}
          </div>
        )}
        <div className="text-body-03 break-words whitespace-pre-wrap">
          <Primitives.LinkifiedText>{message.text}</Primitives.LinkifiedText>
        </div>
        {}
        {renderActions()}
        <div className="text-text-secondary text-micro-01 text-[10px] pt-3">
          {timeFormatter.format(message.timestamp.getTime())}
        </div>
      </div>
    );
  }

  const renderActions = () => {
    if (!smartMessage) {
      return null;
    }

    const content = smartMessage.content;

    const elements = content.layout.elements.flat().map((layoutElement) => {
      if (layoutElement.type === 'button') {
        const buttonAction = layoutElement.action;
        if (buttonAction.type === 'SIGN_TRANSACTION') {
          return (
            <Primitives.ButtonBase
              key={layoutElement.text}
              onClick={() =>
                handleSmartMessageAction(
                  smartMessage.id,
                  buttonAction.humanReadableId
                )
              }
            >
              {layoutElement.text}
            </Primitives.ButtonBase>
          );
        }
        if (buttonAction.type === 'OPEN_LINK') {
          return (
            <a
              key={layoutElement.text}
              href={buttonAction.link}
              target="_blank"
              className={
                'text-body-03-medium flex flex-row items-center gap-0.5 pt-3 font-semibold ' +
                messageStyles.link
              }
              rel="noreferrer"
            >
              {layoutElement.text}→
            </a>
          );
        }
      }
      return (
        <div key={layoutElement.text} className="text-body-03">
          {layoutElement.text}
        </div>
      );
    });
    return <div className="pt-3">{elements}</div>;
  };

  return (
    <div className="py-3 px-4 gap-4 flex flex-row items-center relative overflow-hidden">
      <div className="relative">
        <div
          className={
            'shadow-[0px_0px_60px_50px] opacity-20 absolute left-4 top-4 ' +
            messageStyles.shadow
          }
        />
        <div
          className={
            'w-8 h-8 rounded-full bg-opacity-10 p-1.5 ' +
            messageStyles.iconBackground
          }
        >
          <div
            className={
              'rounded-full h-full w-full flex items-center justify-center ' +
              messageStyles.iconBackground
            }
          >
            {renderIcon()}
          </div>
        </div>
      </div>
      {renderMessage()}
    </div>
  );
};
