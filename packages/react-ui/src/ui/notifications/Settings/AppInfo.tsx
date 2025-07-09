import { REACT_SDK_VERSION } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { version as REACT_UI_VERSION } from '../../../../package.json';
import { DialectLogo } from '../../core/icons';
import { ClassTokens } from '../../theme';
export const AppInfo = () => {
  return (
    <div
      className={clsx(
        'dt-sticky dt-bottom-0 dt-z-10 dt-flex dt-items-center dt-justify-between dt-gap-2.5 dt-px-3 dt-py-4',
        ClassTokens.Background.Primary,
      )}
    >
      <span className="dt-inline-flex dt-items-center dt-text-caption">
        Powered By{' '}
        <a
          href="https://dialect.to"
          target="_blank"
          rel="noreferrer"
          className="hover:dt-text-inherit"
        >
          <DialectLogo className="-dt-mt-[1px] dt-ml-[3px]" />
        </a>
      </span>

      <div className="dt-flex dt-items-center dt-justify-center">
        <span className={clsx('dt-text-caption', ClassTokens.Text.Tertiary)}>
          {REACT_UI_VERSION} / {REACT_SDK_VERSION}
        </span>
      </div>
    </div>
  );
};
