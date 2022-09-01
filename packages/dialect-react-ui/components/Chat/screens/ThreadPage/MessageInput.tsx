import type { KeyboardEvent, FormEvent } from 'react';
import clsx from 'clsx';
import { ButtonBase, Textarea } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Loader } from '../../../common';
import type { DialectSdkError } from '@dialectlabs/react-sdk';

type PropsType = {
  text: string;
  setText: (text: string) => void;
  error: DialectSdkError | null | undefined;
  setError: (error: DialectSdkError | null | undefined) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onEnterPress: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disableSendButton: boolean;
  inputDisabled: boolean;
};

export default function MessageInput({
  text,
  setText,
  setError,
  onSubmit,
  onEnterPress,
  disableSendButton,
  inputDisabled,
}: PropsType): JSX.Element {
  const { icons, textArea, sendButton } = useTheme();
  return (
    <div>
      <div className="dt-flex dt-flex-col dt-pb-2 dt-mb-2">
        <form onSubmit={onSubmit}>
          <div className="dt-relative">
            <div className="dt-text-sm dt-break-words dt-py-1 dt-pl-2 dt-pr-11 dt-invisible">
              {text || 'h'}
            </div>
            <div className="dt-absolute dt-top-0 dt-w-full dt-h-full dt-flex dt-flex-grow dt-items-center">
              <Textarea
                value={text}
                onChange={(e) => {
                  setError(null);
                  setText(e.target.value);
                }}
                onKeyDown={onEnterPress}
                placeholder="Write something"
                className={clsx(
                  textArea,
                  'dt-resize-none dt-h-full dt-w-full dt-no-scrollbar'
                )}
                disabled={inputDisabled}
              />
              <ButtonBase
                className="dt-button dt-absolute dt-inset-y-0 dt--right-2 dt-flex dt-items-center dt-pr-3 disabled:dt-cursor-not-allowed"
                disabled={disableSendButton}
              >
                {inputDisabled ? (
                  <Loader />
                ) : (
                  <icons.arrowsmright
                    className={clsx(
                      sendButton,
                      disableSendButton ? 'dt-opacity-50' : ''
                    )}
                  />
                )}
              </ButtonBase>
            </div>
          </div>
        </form>
        <div className="dt-flex dt-justify-between">
          <div className="dt-flex dt-mt-1 dt-space-x-3">
            {/* {error ? (
              <div className="dt-text-xs dt-pl-1 dt-text-red-500">
                Error: {error.message}
              </div>
            ) : ( */}
            <div className="dt-text-xs dt-pl-1 dt-opacity-50">
              {text.length}/280
            </div>
            {/* )} */}

            {/* <div className="dt-text-xs">⊙ {0 || '–'}</div> */}
          </div>
          {!disableSendButton && (
            <div className="dt-flex dt-text-xs dt-items-center dt-opacity-50 dt-pr-1">
              enter ⏎
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
