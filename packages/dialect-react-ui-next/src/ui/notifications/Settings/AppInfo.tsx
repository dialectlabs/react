import clsx from 'clsx';
import { DialectLogo } from '../../core/icons';
import { ClassTokens } from '../../theme';
export const AppInfo = () => {
  return (
    <div className="dt-flex dt-flex-col dt-items-center dt-justify-center dt-gap-2.5">
      <div
        className={clsx(
          'dt-inline-flex dt-items-center dt-justify-center dt-rounded-2xl dt-px-2 dt-py-1 dt-text-caption',
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
          {/* TODO versions*/}
          {/*{UI_VERSION} / {SDK_VERSION}*/}
          2.0.0 / 1.2.1
        </span>
      </div>
    </div>
  );
};
