import { Connection, clusterApiUrl, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { createTransferInstruction } from '@solana/spl-token';

export enum MessageType {
  Simple = 'Simple',
  Smart = 'Smart',
}

const readableSplTokens: {[key: string]: string} = {
  '4WLSCEkDt3UYEhKqzajDww7NAu9kUgS4yfgjY1CEoH7m': 'USDC',
  '': '◎',
}

export interface ParsedMessage {
  text: string;
  amount?: Number;
  splToken?: string,
  reference?: string,
  imageUrl?: string;
  label?: string;
  type: MessageType;
  onClick?: (sender: PublicKey, recipient: PublicKey, amount: number) => void; 
}

// Parse a user message and decide if this is a smart message or a simple message
// Attempts to be paranoid about untrusted user input
export function parseMessage(text: string, you: PublicKey): ParsedMessage {
  /*
  solana:<recipient>
      ?amount=<amount>
      &spl-token=<spl-token>
      &reference=<reference>
      &label=<label>
      &message=<message>
      &memo=<memo>
  */

      "lgtm solana:3vuCFLbVWsNeWgyxkb2xiLQuxKDW83HWiTMmodT8gmtk?amount=10&spl-token=&label=Send%2010%20USDC"

  // Check if transaction request https://stackoverflow.com/a/3809435/2322073
  const reg = /solana:https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const isTransactionRequest = reg.test(text);

  // TODO: Do this with regex
  const isTransferRequest = !text.includes('solana:https://') && text.includes('solana:') && text.includes('amount=') && text.includes('spl-token=');
  
  if (!isTransferRequest) {
    return {
      text,
      type: MessageType.Simple,
    }
  }

  // Probably a smart message
  let startPosition = text.indexOf('solana:');
  let url = new URL(text.slice(startPosition).split(' ')[0]!)
  const text_ = text.slice(0, startPosition);
  let recipient = url.pathname;
  let amount = url.searchParams.get('amount') || undefined;
  let splToken = url.searchParams.get('spl-token') || undefined;
  let reference = url.searchParams.get('reference') || undefined;
  let label = `${amount} ${readableSplTokens[splToken ?? ""]}`
  if (recipient === you.toBase58()) {
    label = `Requested ${label}`;
  } else {
    label = `Send ${label}`;
  }

  // Ensure that the fields exist that are required
  if (!amount || !splToken) {
    // Invalid url
    throw Error("Invalid solana pay url");
  }
  let parsedAmount = parseInt(amount);
  if (isTransferRequest) {
    return {
      text: text_,
      amount: parsedAmount,
      splToken,
      type: MessageType.Smart,
      onClick: () => initiateTransfer(you, new PublicKey(recipient), parsedAmount),
    }
  }
  // Likely a transaction request

  // TODO: ImageURL 
  return {
    text: text_,
    amount: parsedAmount,
    splToken,
    imageUrl: 'https://solanapay.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsolanapay-logo.e34e7b7f.svg&w=384&q=75',
    reference, 
    label,
    type: MessageType.Smart,
  }
}

// Send a transfer request to solana 
export function initiateTransfer(sender: PublicKey, recipient: PublicKey, amount: number) {
  let transfer = createTransferInstruction(sender, recipient, sender, amount); 

  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );
  await sendAndConfirmTransaction(connection, transfer, [fromKeypair]);
}