export function getAppId(argAppId: string | boolean, globalAppId?: string | null) {
  if (typeof argAppId === 'string') {
    return argAppId;
  }

  return argAppId ? globalAppId ?? null : null;
}