import React from 'react';
import { useApi } from '@dialectlabs/react';
import { display, isDialectAdmin } from '@dialectlabs/web3';
import { useDialect } from '@dialectlabs/react';
import IconButton from '../IconButton';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';

export default function Header(props: {
  isReady: boolean;
  isCreateOpen: boolean;
  toggleCreate: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();
  const { dialect, dialectAddress, setDialectAddress, disconnectedFromChain } =
    useDialect();
  const { wallet } = useApi();

  const isAdmin =
    dialect && wallet?.publicKey && isDialectAdmin(dialect, wallet?.publicKey);

  if (props.isCreateOpen) {
    return (
      <div className={cs('dt-flex dt-flex-row dt-items-center', header)}>
        <IconButton
          icon={<icons.x />}
          onClick={props.toggleCreate}
          className="dt-mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}></span>
      </div>
    );
  } else if (props.isSettingsOpen) {
    return (
      <div className={cs('dt-flex dt-flex-row dt-items-center', header)}>
        <IconButton
          icon={<icons.back />}
          onClick={props.toggleSettings}
          className="dt-mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}>Settings</span>
      </div>
    );
  } else if (dialectAddress) {
    const otherMembers =
      dialect?.dialect.members.filter(
        (member) =>
          member.publicKey.toString() !== wallet?.publicKey?.toString()
      ) || [];
    const otherMembersStrs = otherMembers.map((member) =>
      display(member.publicKey)
    );
    const otherMemberStr = otherMembers ? otherMembersStrs[0] : '';
    return (
      <div
        className={cs(
          'dt-relative dt-flex dt-flex-row dt-items-center dt-justify-between',
          header
        )}
      >
        <IconButton
          icon={<icons.back />}
          onClick={() => setDialectAddress('')}
          className="dt-mr-2 dt-absolute"
        />
        <div className="dt-flex dt-flex-col dt-items-center">
          <span className={cs(textStyles.header, colors.accent)}>
            {otherMemberStr}
          </span>
          {dialect?.dialect.encrypted ? (
            <span className="dt-text-xs dt-opacity-50">encrypted</span>
          ) : (
            <span className="dt-text-xs dt-opacity-50">unencrypted</span>
          )}
        </div>
        {props.isReady ? (
          <IconButton
            className={isAdmin ? '' : 'dt-invisible'}
            icon={<icons.settings />}
            onClick={props.toggleSettings}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cs(
        'dt-flex dt-flex-row dt-items-center dt-justify-between',
        header
      )}
    >
      <span className={cs(textStyles.header, colors.primary)}>Messages</span>
      {props.isReady && !disconnectedFromChain ? (
        <IconButton icon={<icons.compose />} onClick={props.toggleCreate} />
      ) : null}
    </div>
  );
}
