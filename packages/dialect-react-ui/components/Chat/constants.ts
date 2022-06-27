export enum RouteName {
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
  SigningRequest = 'sign_wallet',
  EncryptionRequest = 'encryption_request',
  Main = 'main',
}

export enum MainRouteName {
  CreateThread = 'create_thread',
  Thread = 'thread',
}

export enum ThreadRouteName {
  Messages = 'messages',
  Settings = 'settings',
}
