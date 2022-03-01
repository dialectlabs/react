import * as anchor from '@project-serum/anchor';
import {
  createMetadata as originalCreateMetadata,
  deleteMetadata as originalDeleteMetadata,
  getMetadata,
  Metadata, // TOOD: Use this
} from '@dialectlabs/web3';
import { withErrorParsing } from '../utils/errors';

/**
 * Create a readonly thread (a.k.a. dialect) between 2 users
 *
 * @param program {anchor.Program}
 * @param pubkey1 {string}
 * @param pubkey2 {string}
 */
export const createMetadata = withErrorParsing(
  async (program: anchor.Program) => {
    return await originalCreateMetadata(program, program.provider.wallet);
  }
);

/**
 * Get a thread (a.k.a. dialect) for two users
 *
 * @param program {anchor.Program}
 * @param pubkey1 {string}
 * @param pubkey2 {string}
 */
export const fetchMetadata = withErrorParsing(
  async (program: anchor.Program) => {
    return await getMetadata(program, program.provider.wallet.publicKey);
  }
);

/**
 * Delete existing thread (a.k.a. dialect)
 *
 * @param program {anchor.Program}
 * @param dialect {DialectAccount}
 * @param ownerPKString {string}
 */
export const deleteMetadata = withErrorParsing(
  async (program: anchor.Program) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - we need to address this, since it needs a Keypair or Wallet as third param
    return await originalDeleteMetadata(program, program.provider.wallet);
  }
);
