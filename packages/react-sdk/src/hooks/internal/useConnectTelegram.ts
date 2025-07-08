import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../../context';
import { getRequestHeaders } from './api-v2-helpers';
import { 
  CACHE_KEY_TELEGRAM_PREPARE_MUTATION,
  CACHE_KEY_TELEGRAM_UNLINK_MUTATION,
} from './swrCache';
import useDialectSdk from '../useDialectSdk';
import { SubscriberChannel } from '../types';

export type TelegramPrepareResponse = SubscriberChannel & {
  verification: {
    link: string;
  }
};

export interface UseConnectTelegramValue {
  prepare: () => Promise<TelegramPrepareResponse>;
  unlink: () => Promise<void>;
  isPreparing: boolean;
  isUnlinking: boolean;
  errorPreparing: Error | null;
  errorUnlinking: Error | null;
}

/**
 * @internal
 * This hook is intended for internal use within the Dialect React UI package.
 * It provides Telegram connection functionality using non-public APIs.
 * Third-party developers should not use this hook directly.
 */
export default function useConnectTelegram(): UseConnectTelegramValue {
  const {
    clientKey,
  } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    trigger: triggerPrepare,
    isMutating: isPreparing,
    error: errorPreparing,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_TELEGRAM_PREPARE_MUTATION() : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/telegram/prepare`,
        {
          method: 'POST',
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<TelegramPrepareResponse>;
    },
  );

  const {
    trigger: triggerUnlink,
    isMutating: isUnlinking,
    error: errorUnlinking,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_TELEGRAM_UNLINK_MUTATION() : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/channel/telegram/unlink`,
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
    unlink: triggerUnlink,
    isPreparing,
    isUnlinking,
    errorPreparing,
    errorUnlinking,
  };
} 