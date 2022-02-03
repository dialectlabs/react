import * as anchor from '@project-serum/anchor';
import {
  createDialect,
  deleteDialect as originalDeleteDialect,
  DialectAccount,
  getDialectForMembers,
  Member,
} from '@dialectlabs/web3';
import { withErrorParsing } from '../utils/errors';

/**
 * Create a readonly thread (or dialect) between 2 users
 *
 * @param program {anchor.Program}
 * @param pubkey1 {string}
 * @param pubkey2 {string}
 */
export const createDialectForMembers = withErrorParsing(
  async (program: anchor.Program, pubkey1: string, pubkey2: string) => {
    const member1: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey1),
      scopes: [true, false], //
    };
    const member2: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey2),
      scopes: [true, false], //
    };
    return await createDialect(program, program.provider.wallet, [
      member1,
      member2,
    ]);
  }
);

export const fetchDialectForMembers = withErrorParsing(
  async (program: anchor.Program, pubkey1: string, pubkey2: string) => {
    const member1: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey1),
      scopes: [true, false], //
    };
    const member2: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey2),
      scopes: [true, false], //
    };
    return await getDialectForMembers(
      program,
      [member1, member2],
      anchor.web3.Keypair.generate()
    );
  }
);

export const deleteDialect = withErrorParsing(
  async (
    program: anchor.Program,
    dialect: DialectAccount,
    ownerPKString: string
  ) => {
    const owner: Member = {
      publicKey: new anchor.web3.PublicKey(ownerPKString),
      scopes: [true, false], //
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - we need to address this, since it needs a Keypair or Wallet as third param
    return await originalDeleteDialect(program, dialect, owner);
  }
);
