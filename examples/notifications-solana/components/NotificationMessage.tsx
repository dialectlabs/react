import { Primitives, ThreadMessage } from '@dialectlabs/react-ui';
import { smartMessageApi } from './smart-messages/api';
import { useDialectSdk } from '@dialectlabs/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';

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
  const dialectSdk = useDialectSdk();

  const wallet = useWallet();

  const dialectCloudUrl = dialectSdk.config.dialectCloud.url;

  //'announcement' or 'filled-order'
  const smartMessage = message.metadata?.smartMessage;

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
              onClick={async () => {
                try {
                  // alert('clicked sign tx');
                  const token = await dialectSdk.tokenProvider.get();
                  const tx =
                    await smartMessageApi.createSmartMessageTransaction(
                      `${dialectCloudUrl}/api/v1/smart-messages/${smartMessage.id}`,
                      token.rawValue,
                      {
                        actionHumanReadableId: buttonAction.humanReadableId,
                      }
                    );
                  if (!tx) {
                    console.error('Failed to create transaction');
                    return;
                  }
                  if (!wallet.signTransaction) {
                    console.error(
                      'Wallet does not support signing transactions'
                    );
                    return;
                  }
                  const txBase64 = tx.transaction;
                  const txBuffer = Buffer.from(txBase64, 'base64');
                  const versionedTransaction =
                    VersionedTransaction.deserialize(txBuffer);
                  const signed = await wallet.signTransaction(
                    versionedTransaction
                  );
                  await smartMessageApi.submitSmartMessageTransaction(
                    `${dialectCloudUrl}/api/v1/smart-messages/${smartMessage.id}`,
                    token.rawValue,
                    {
                      actionHumanReadableId: buttonAction.humanReadableId,
                      transaction: Buffer.from(signed.serialize()).toString(
                        'base64'
                      ),
                    }
                  );
                  // TODO: mutate SWR here

                  console.log(`Created transaction: ${tx?.transaction}`);
                } catch (e) {
                  console.error('Failed to sign transaction', e);
                }
              }}
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
