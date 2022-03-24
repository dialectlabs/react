import React, { KeyboardEvent, FormEvent } from 'react';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';

type PropsType = {
  text: string;
  setText: (text: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onEnterPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
};

export default function MessageInput({
  text,
  setText,
  onSubmit,
  onEnterPress,
  disabled,
}: PropsType): JSX.Element {
  const { icons, textArea, sendButton } = useTheme();
  // const { data } = useSWR(
  //   connection && wallet ? ['/owner', wallet, connection] : null,
  //   ownerFetcher
  // );
  // const balance: number | undefined = data?.lamports
  //   ? data.lamports / 1e9
  //   : undefined;
  return (
    <div className="dialect">
      <div className="dt-flex dt-flex-col dt-pb-2 dt-mb-2">
        <form onSubmit={onSubmit}>
          <div className="dt-relative">
            <div className="dt-text-sm dt-break-words dt-py-1 dt-pl-2 dt-pr-11">
              {text || 'h'}
            </div>
            <div className="dt-absolute dt-top-0 dt-w-full dt-h-full dt-flex dt-flex-grow dt-items-center">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onEnterPress}
                placeholder="Write something"
                className={cs(textArea, 'dt-resize-none dt-h-full dt-w-full')}
              />
              <button
                className="dt-absolute dt-inset-y-0 -dt-right-2 dt-flex dt-items-center dt-pr-3 disabled:dt-cursor-not-allowed"
                disabled={disabled}
              >
                <icons.arrowsmright
                  className={cs(sendButton, disabled ? 'dt-opacity-50' : '')}
                />
              </button>
            </div>
          </div>
        </form>
        <div className="dt-flex dt-justify-between">
          <div className="dt-flex dt-space-x-3">
            <div className="dt-text-xs dt-pl-1">{text.length}/280</div>
            {/* <div className="dt-text-xs">⊙ {0 || '–'}</div> */}
          </div>
          {!disabled && (
            <div className="dt-flex dt-text-xs dt-items-center dt-pr-1">
              enter
              <icons.arrownarrowright className="dt-h-4 dt-w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
