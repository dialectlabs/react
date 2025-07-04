import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../../context';
import { getRequestHeaders } from './api-v2-helpers';
import {
  CACHE_KEY_EMAIL_PREPARE_MUTATION,
  CACHE_KEY_EMAIL_VERIFY_MUTATION,
} from './swrCache';
import useDialectSdk from '../useDialectSdk';
import { SubscriberChannel } from '../types';

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
  isPreparing: boolean;
  isVerifying: boolean;
  errorPreparing: Error | null;
  errorVerifying: Error | null;
}

/**
 * @internal
 * This hook is intended for internal use within the Dialect React UI package.
 * It provides email connection functionality using non-public APIs.
 * Third-party developers should not use this hook directly.
 */
export default function useConnectEmail(): UseConnectEmailValue {
  const {
    clientKey,
  } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    trigger: triggerPrepare,
    isMutating: isPreparing,
    error: errorPreparing,
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

  return {
    prepare: triggerPrepare,
    verify: triggerVerify,
    isPreparing,
    isVerifying,
    errorPreparing,
    errorVerifying,
  };
} 