export interface CreateSmartMessageTransactionCommandDto {
  actionHumanReadableId: string;
}

export interface SmartMessageTransactionDto {
  transaction: string;
  message?: string;
}

export interface SmartMessageLinksDto {
  self: string;
}

export enum SmartMessageSystemActionId {
  Cancel = 'CANCEL',
}

export enum SmartMessageActionType {
  SignTransaction = 'SIGN_TRANSACTION',
  Cancel = 'CANCEL',
}

export interface SmartMessageActionDto {
  humanReadableId: string | SmartMessageSystemActionId;
  type: SmartMessageActionType;
}

interface SmartMessageLayoutElementDto {
  type: 'label' | 'button';
  text: string;
  action?: SmartMessageActionDto;
  header?: string;
  description?: string;
  subheader?: string;
}

export interface SmartMessageLayoutDto {
  icon: string;
  header: string | null;
  description: string | null;
  subheader: string | null;
  elements: SmartMessageLayoutElementDto[][];
}

export interface SmartMessageContentDto {
  state: SmartMessageStateDto;
  layout: SmartMessageLayoutDto;
  label?: string;
  button?: string;
}

export interface SmartMessageDto {
  id: string;
  content: SmartMessageContentDto;
  links: SmartMessageLinksDto;
}

export enum SmartMessageStateDto {
  Created = 'CREATED',
  ReadyForExecution = 'READY_FOR_EXECUTION',
  Executing = 'EXECUTING',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
  Canceled = 'CANCELED',
}

export interface CreateTokenTransferCommandDto {
  payerWalletAddress: string;
  payeeWalletAddress: string;
  tokenMintAddress?: string;
  amount: string;
}

export interface SubmitSmartMessageTransactionCommandDto {
  transaction: string;
  actionHumanReadableId: string;
}

export interface NftCommand {
  payerWalletAddress: string;
  payeeWalletAddress: string;
  label: string;
  description: string | null;
  subheader: string;
  header: string;
  chainId: string;
  previewUrl: string;
}

export interface StickerBuyOfferCommand {
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  amount: string;
  assetId: string;
  assetName: string;
  imageUrl: string;
  sellerFeeBps: number;
}

export enum TokenTransferType {
  NFT = 'nft',
  TOKEN = 'token',
  STICKER_BUY_OFFER = 'sticker_buy_offer',
}
