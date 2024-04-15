import { REACT_SDK_VERSION } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { version as REACT_UI_VERSION } from '../../../../package.json';
import { DialectLogo } from '../../core/icons';
import { ClassTokens } from '../../theme';
export const AppInfo = () => {
  return (
    <div className="dt-flex dt-flex-col dt-items-center dt-justify-center dt-gap-2.5">
      <div
        className={clsx(
          'dt-inline-flex dt-items-center dt-justify-center dt-px-2 dt-py-1 dt-text-caption',
          ClassTokens.Radius.Large,
          ClassTokens.Background.Secondary,
          ClassTokens.Text.Tertiary,
        )}
      >
        Powered By{' '}
        <a
          href="https://dialect.to"
          target="_blank"
          rel="noreferrer"
          className="hover:dt-text-inherit"
        >
          <DialectLogo className="-dt-mt-[1px] dt-ml-[3px]" />
        </a>
      </div>

      <div className="dt-flex dt-items-center dt-justify-center">
        <span className={clsx('dt-text-caption', ClassTokens.Text.Tertiary)}>
          {REACT_UI_VERSION} / {REACT_SDK_VERSION}
        </span>
      </div>
    </div>
  );
};
