import * as anchor from '@project-serum/anchor';
import {
  createDialect,
  deleteDialect as originalDeleteDialect,
  DialectAccount,
  findDialects,
  getDialect,
  getDialectForMembers,
  getDialectProgramAddress,
  Member,
  sendMessage as originalSendMessage,
} from '@dialectlabs/web3';
import { withErrorParsing } from '../utils/errors';
import type { EncryptionProps } from '@dialectlabs/web3/lib/es/api/text-serde';

const todayFormatter = new Intl.DateTimeFormat('en-US', {
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
});

const nonTodayFormatter = new Intl.DateTimeFormat('en-US', {
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
  month: 'numeric',
  day: 'numeric',
});

export const formatTimestamp = (timestamp: number) => {
  /*
  If today, show time only, e.g. 4:28 PM
  If yesterday, show date & time, e.g. 1/10 7:58 PM
  If last year: We've got time not to implement this.
  */
  const dayStart = new Date().setHours(0, 0, 0, 0);
  const messageDayStart = new Date(timestamp).setHours(0, 0, 0, 0);
  const isToday = messageDayStart === dayStart;
  const formatter = isToday ? todayFormatter : nonTodayFormatter;
  return formatter.format(timestamp);
};

export const getDialectAddressWithOtherMember = async (
  program: anchor.Program,
  publicKey: anchor.web3.PublicKey
) => {
  return await getDialectAddressForMemberPubkeys(
    program,
    program.provider.wallet.publicKey,
    publicKey
  );
};

// TODO: Move to protocol
export const getDialectAddressForMemberPubkeys = async (
  program: anchor.Program,
  pubkey1: anchor.web3.PublicKey,
  pubkey2: anchor.web3.PublicKey
) => {
  return await getDialectProgramAddress(program, [
    { publicKey: pubkey1, scopes: [true, true] },
    { publicKey: pubkey2, scopes: [true, true] },
  ]);
};

/**
 * Create a readonly thread (a.k.a. dialect) between 2 users
 *
 * @param program {anchor.Program}
 * @param pubkey1 {string}
 * @param pubkey2 {string}
 * @param scopes1 {boolean[]}
 * @param scopes2 {boolean[]}
 */
export const createDialectForMembers = withErrorParsing(
  async (
    program: anchor.Program,
    pubkey1: string,
    pubkey2: string,
    scopes1: [boolean, boolean],
    scopes2: [boolean, boolean],
    encryptionProps?: EncryptionProps | null
  ) => {
    const member1: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey1),
      scopes: scopes1, // recipient of notifications, is admin but does not have write privileges
    };
    const member2: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey2),
      scopes: scopes2, // monitoring service that sends notifications, is not admin but does have write privilages
    };
    return await createDialect(
      program,
      program.provider.wallet,
      [member1, member2],
      Boolean(encryptionProps),
      encryptionProps
    );
  }
);

/**
 * Get a thread (a.k.a. dialect) for two users
 *
 * @param program {anchor.Program}
 * @param pubkey1 {string}
 * @param pubkey2 {string}
 */
export const fetchDialectForMembers = withErrorParsing(
  async (program: anchor.Program, pubkey1: string, pubkey2: string) => {
    const member1: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey1),
      scopes: [true, false], //
    };
    const member2: Member = {
      publicKey: new anchor.web3.PublicKey(pubkey2),
      scopes: [false, true], //
    };
    return await getDialectForMembers(
      program,
      [member1, member2],
      anchor.web3.Keypair.generate()
    );
  }
);

export const fetchDialect = withErrorParsing(
  async (
    program: anchor.Program,
    address: string,
    encryptionProps?: EncryptionProps | null
  ) => {
    return await getDialect(
        program,
        new anchor.web3.PublicKey(address),
        encryptionProps
    );
  }
);

export const fetchDialects = withErrorParsing(
  async (program: anchor.Program, user: string) => {
      return await findDialects(program, {
        userPk: new anchor.web3.PublicKey(user)
      });
  }
);

/**
 * Delete existing thread (a.k.a. dialect)
 *
 * @param program {anchor.Program}
 * @param dialect {DialectAccount}
 * @param ownerPKString {string}
 */
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

export const sendMessage = withErrorParsing(
  async (
    program: anchor.Program,
    dialect: DialectAccount,
    text: string,
    encryptionProps?: EncryptionProps | null
  ) => {
    return await originalSendMessage(
      program,
      dialect,
      program.provider.wallet,
      text,
      encryptionProps
    );
  }
);
