import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../../context';
import { SubscriberChannel } from '../types';
import useDialectSdk from '../useDialectSdk';
import { getRequestHeaders } from './api-v2-helpers';
import {
  CACHE_KEY_EMAIL_PREPARE_MUTATION,
  CACHE_KEY_EMAIL_RESEND_MUTATION,
  CACHE_KEY_EMAIL_UNLINK_MUTATION,
  CACHE_KEY_EMAIL_VERIFY_MUTATION,
} from './swrCache';

// Types for email connection
export interface EmailPrepareRequest {
  value: string;
}

export type EmailPrepareResponse = SubscriberChannel;

export interface EmailVerifyRequest {
  code: string;
}

export interface UseConnectEmailValue {
  prepare: (params: EmailPrepareRequest) => Promise<EmailPrepareResponse>;
  verify: (params: EmailVerifyRequest) => Promise<void>;
  unlink: () => Promise<void>;
  resend: () => Promise<void>;
  isPreparing: boolean;
  isVerifying: boolean;
  isUnlinking: boolean;
  isResending: boolean;
  errorPreparing: Error | null;
  errorVerifying: Error | null;
  errorUnlinking: Error | null;
  errorResending: Error | null;
  resetPreparing: () => void;
  resetVerifying: () => void;
  resetUnlinking: () => void;
  resetResending: () => void;
}

/**
 * @internal
 * This hook is intended for internal use within the Dialect React UI package.
 * It provides email connection functionality using non-public APIs.
 * Third-party developers should not use this hook directly.
 */
export default function useConnectEmail(): UseConnectEmailValue {
  const { clientKey } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    trigger: triggerPrepare,
    isMutating: isPreparing,
    error: errorPreparing,
    reset: resetPreparing,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_EMAIL_PREPARE_MUTATION() : null,
    async (_, { arg }: { arg: EmailPrepareRequest }) => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/email/prepare`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<EmailPrepareResponse>;
    },
  );

  const {
    trigger: triggerVerify,
    isMutating: isVerifying,
    error: errorVerifying,
    reset: resetVerifying,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_EMAIL_VERIFY_MUTATION() : null,
    async (_, { arg }: { arg: EmailVerifyRequest }) => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/email/verify`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<void>;
    },
  );

  const {
    trigger: triggerUnlink,
    isMutating: isUnlinking,
    error: errorUnlinking,
    reset: resetUnlinking,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_EMAIL_UNLINK_MUTATION() : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/email/delete`,
        {
          method: 'POST',
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<void>;
    },
  );

  const {
    trigger: triggerResend,
    isMutating: isResending,
    error: errorResending,
    reset: resetResending,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_EMAIL_RESEND_MUTATION() : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/email/resend`,
        {
          method: 'POST',
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<void>;
    },
  );

  return {
    prepare: triggerPrepare,
    verify: triggerVerify,
    unlink: triggerUnlink,
    resend: triggerResend,
    isPreparing,
    isVerifying,
    isUnlinking,
    isResending,
    errorPreparing,
    errorVerifying,
    errorUnlinking,
    errorResending,
    resetPreparing,
    resetVerifying,
    resetUnlinking,
    resetResending,
  };
}
