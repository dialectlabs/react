import clsx from 'clsx';
import { DialectLogo } from '../../core/icons/DialectLogo';
import { ClassTokens } from '../../theme';
export const AppInfo = () => {
  return (
    <div className="dt-flex dt-flex-col dt-justify-center dt-items-center dt-gap-2.5">
      <div
        className={clsx(
          'dt-inline-flex dt-items-center dt-justify-center dt-py-1 dt-px-2 dt-rounded-2xl dt-text-caption',
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
          <DialectLogo className="dt-ml-[3px] -dt-mt-[1px]" />
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
