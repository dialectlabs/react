/**
 * @internal
 * Internal hooks for use within the Dialect React UI package.
 * These hooks use non-public APIs and may have breaking changes in the future.
 */

export { default as useConnectEmail } from './useConnectEmail';
export type {
  EmailPrepareRequest,
  EmailPrepareResponse,
  EmailVerifyRequest,
  UseConnectEmailValue,
} from './useConnectEmail';

export { default as useConnectTelegram } from './useConnectTelegram';
export type {
  TelegramPrepareResponse,
  UseConnectTelegramValue,
} from './useConnectTelegram'; 