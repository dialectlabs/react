import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import {
  CACHE_KEY_TELEGRAM_PREPARE_MUTATION,
  CACHE_KEY_TELEGRAM_UNLINK_MUTATION,
} from './internal/swrCache';
import { SubscriberChannel } from './types';
import useDialectSdk from './useDialectSdk';

export type TelegramPrepareResponse = SubscriberChannel & {
  verification: {
    link: string;
  };
};

export interface UseConnectTelegramValue {
  prepare: () => Promise<TelegramPrepareResponse>;
  unlink: () => Promise<void>;
  isPreparing: boolean;
  isUnlinking: boolean;
  errorPreparing: Error | null;
  errorUnlinking: Error | null;
}

export default function useConnectTelegram(): UseConnectTelegramValue {
  const { clientKey } = useDialectContext();
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
        `${sdk.config.dialectCloud.v2Url}/v2/channel/telegram/prepare`,
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
        `${sdk.config.dialectCloud.v2Url}/v2/channel/telegram/delete`,
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
