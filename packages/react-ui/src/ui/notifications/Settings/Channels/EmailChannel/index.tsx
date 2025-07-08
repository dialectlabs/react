import {
  Internal,
  useChannels,
  useSubscribe,
  useUnsubscribe,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { Badge, Button, ButtonType, IconButton, Input } from '../../../../core';
import { Label } from '../../../../core/primitives/Label';
import { ClassTokens, Icons } from '../../../../theme';

const RESEND_DELAY_MS = 60 * 1000; // 60 seconds
const CLEAR_ERRORS_DELAY_MS = 5 * 1000; // 5 seconds

export const EmailChannel = ({
  allowConnecting = true,
  keyAction,
}: {
  allowConnecting?: boolean;
  keyAction?: ReactNode; // component to render if the connection reached a terminal state (if either connected and verified, or allowedConnecting = false)
}) => {
  const { channels, refresh, isLoading: isChannelsLoading } = useChannels();
  const channel = channels?.EMAIL;

  // State for email input and code input
  const [inputValue, setInputValue] = useState(channel?.value ?? '');
  const [code, setCode] = useState('');
  const [resendCodeTimeout, setResendCodeTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [resendCountdownSecond, setResendCountdownSecond] = useState<
    number | null
  >(null);

  const {
    prepare,
    verify,
    unlink,
    resend,
    isPreparing,
    isVerifying,
    isUnlinking,
    isResending,
    errorPreparing,
    errorVerifying,
    errorResending,
    resetResending,
  } = Internal.useConnectEmail();

  // Determine state
  const isEmailSaved = Boolean(channel?.value);
  const isVerified = Boolean(channel?.verified);
  const verificationNeeded = isEmailSaved && !isVerified;

  // Email validation
  const isEmailInvalid =
    inputValue.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputValue);

  const isCodeValid = new RegExp('^[0-9]{6}$').test(code);

  // Handlers
  const handlePrepare = async () => {
    try {
      await prepare({ value: inputValue });
      setResendCodeTimeout(
        setTimeout(() => setResendCodeTimeout(null), RESEND_DELAY_MS),
      );
      await refresh();
    } catch (error) {
      // noop
    }
  };

  const handleVerify = async () => {
    try {
      await verify({ code });
      await refresh();
      setCode('');
      setResendCodeTimeout(null);
    } catch (error) {
      // noop
    }
  };

  const handleUnlink = async () => {
    try {
      await unlink();
      await refresh();
      setInputValue('');
      setCode('');
    } catch (error) {
      // noop
    }
  };

  const handleResend = async () => {
    try {
      resetResending();
      await resend();
      setCode('');
      setResendCodeTimeout(
        setTimeout(() => setResendCodeTimeout(null), RESEND_DELAY_MS),
      );
    } catch (error) {
      // noop
    }
  };

  useEffect(() => {
    return () => {
      // cleanup in case of unmount
      resendCodeTimeout && clearTimeout(resendCodeTimeout);
    };
  }, [resendCodeTimeout]);

  useEffect(() => {
    if (!resendCodeTimeout) {
      setResendCountdownSecond(null);
      return;
    }

    setResendCountdownSecond(60);
    const interval = setInterval(
      () =>
        setResendCountdownSecond((prev) =>
          prev !== null && prev >= 0 ? prev - 1 : null,
        ),
      1000, // 1 second
    );

    return () => clearInterval(interval);
  }, [resendCodeTimeout]);

  // clean errors once read
  useEffect(() => {
    if (errorResending) {
      const timeout = setTimeout(() => resetResending(), CLEAR_ERRORS_DELAY_MS);

      return () => clearTimeout(timeout);
    }
  }, [errorResending, resetResending]);

  const isHandlingPrepare = isChannelsLoading || isPreparing;
  const isHandlingUnlink = isChannelsLoading || isUnlinking;
  const isHandlingVerify = isChannelsLoading || isVerifying;
  const isHandlingResend = isResending;

  const isAnyVerifyActionActive =
    isHandlingVerify || isHandlingResend || isHandlingUnlink;

  // Render
  if (isEmailSaved && isVerified) {
    // Connected & verified
    return (
      <div className="dt-flex dt-items-center dt-justify-between">
        <EmailLabel email={channel?.value} />
        {keyAction}
      </div>
    );
  }

  if (!allowConnecting) {
    return (
      <div className="dt-flex dt-items-center dt-justify-between">
        <EmailLabel
          email={channel?.value ?? 'No email linked to your alerts'}
          showUnverified={channel?.verified === false}
        />
        {keyAction}
      </div>
    );
  }

  if (verificationNeeded) {
    // Awaiting verification
    return (
      <div className="dt-flex-1">
        <div className="dt-mb-2 dt-flex dt-items-center dt-justify-between">
          <EmailLabel htmlFor="dt-verification-code" email={channel?.value} />
          <button
            className={clsx(
              'dt-text-text dt-font-medium disabled:dt-opacity-50',
              ClassTokens.Text.Primary,
            )}
            onClick={handleUnlink}
            disabled={isAnyVerifyActionActive}
          >
            Cancel
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <Input
            id="dt-verification-code"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isAnyVerifyActionActive}
            error={!!errorVerifying}
            rightAdornment={
              isHandlingVerify ? (
                <Icons.Loader />
              ) : (
                <IconButton
                  icon={
                    <Icons.ArrowRight
                      className={clsx(ClassTokens.Text.Accent)}
                    />
                  }
                  type="submit"
                  disabled={!code || !isCodeValid || isAnyVerifyActionActive}
                />
              )
            }
          />
        </form>
        <div className="dt-mt-3.5 dt-flex dt-items-start dt-justify-between">
          <span
            className={clsx(
              'dt-text-subtext',
              errorResending
                ? ClassTokens.Text.Error
                : ClassTokens.Text.Tertiary,
            )}
          >
            {errorResending?.message ?? 'Check your Email for a code'}
          </span>
          {resendCountdownSecond === null ? (
            <button
              className={clsx(
                'dt-inline-flex dt-items-center dt-gap-1.5 dt-text-nowrap dt-text-subtext dt-font-medium disabled:dt-opacity-50',
                ClassTokens.Text.Primary,
              )}
              disabled={isAnyVerifyActionActive || resendCodeTimeout !== null}
              onClick={handleResend}
            >
              <Icons.Resend />
              Resend Code
            </button>
          ) : (
            <span
              className={clsx(
                'dt-text-subtext dt-font-medium',
                ClassTokens.Text.Tertiary,
              )}
            >
              {resendCountdownSecond}s
            </span>
          )}
        </div>
      </div>
    );
  }

  // Not connected
  return (
    <form
      className="dt-flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        handlePrepare();
      }}
    >
      <Input
        label={(inputId) => <EmailLabel htmlFor={inputId} />}
        placeholder="Enter your email"
        type="email"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isPreparing || isChannelsLoading}
        rightAdornment={
          isHandlingPrepare ? (
            <Icons.Loader />
          ) : (
            <IconButton
              icon={
                <Icons.ArrowRight className={clsx(ClassTokens.Text.Accent)} />
              }
              type="submit"
              disabled={isHandlingPrepare || !inputValue || isEmailInvalid}
            />
          )
        }
        error={!!errorPreparing || isEmailInvalid}
      />
    </form>
  );
};

export const EmailKeyAction = {
  ToggleSubscribe: () => {
    const { isLoading: isChannelsLoading, channels, refresh } = useChannels();
    const { subscribe, isLoading: isSubscribing } = useSubscribe({
      channel: 'EMAIL',
    });
    const { unsubscribe, isLoading: isUnsubscribing } = useUnsubscribe({
      channel: 'EMAIL',
    });

    const isEmailSubscribed = channels?.EMAIL?.subscribed === true;

    const handleSubscribe = async () => {
      try {
        await subscribe();
        await refresh();
      } catch {
        // noop
      }
    };

    const handleUnubscribe = async () => {
      try {
        await unsubscribe();
        await refresh();
      } catch {
        // noop
      }
    };

    if (isChannelsLoading) {
      return <Button loading={true} />;
    }

    return isEmailSubscribed ? (
      <Button loading={isUnsubscribing} onClick={handleUnubscribe}>
        Unsubscribe
      </Button>
    ) : (
      <Button loading={isSubscribing} onClick={handleSubscribe}>
        Subscribe
      </Button>
    );
  },
  Unlink: () => {
    const { channels, isLoading: isChannelsLoading, refresh } = useChannels();
    const { unlink, isUnlinking } = Internal.useConnectEmail();

    const isEmailPresent = channels?.EMAIL;

    const handleUnlink = async () => {
      try {
        await unlink();
        await refresh();
      } catch {
        // noop
      }
    };

    if (!isEmailPresent) {
      return null;
    }

    return (
      <Button
        type={ButtonType.Destructive}
        loading={isUnlinking || isChannelsLoading}
        onClick={handleUnlink}
      >
        Unlink
      </Button>
    );
  },
};

const EmailLabel = ({
  email,
  htmlFor,
  showUnverified = false,
}: {
  email?: string;
  showUnverified?: boolean;
  htmlFor?: string;
}) => {
  return (
    <Label
      className="dt-inline-flex dt-items-center dt-gap-2"
      htmlFor={htmlFor}
    >
      <Icons.Email />
      <div className="dt-flex dt-flex-col dt-gap-0.5">
        <span className="dt-inline-flex dt-items-center">
          Email{' '}
          {showUnverified && <Badge className="dt-ml-1">Unverified</Badge>}
        </span>
        {email && (
          <span className={clsx('dt-text-subtext', ClassTokens.Text.Tertiary)}>
            {email}
          </span>
        )}
      </div>
    </Label>
  );
};
