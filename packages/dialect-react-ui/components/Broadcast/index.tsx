import { useDapp } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import BroadcastForm from './BroadcastForm';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import DashboardWrapper from '../../entities/wrappers/DashboardWrapper';
import type { ComponentPropsWithoutRef } from 'react';

const Wrapper = (props: ComponentPropsWithoutRef<'div'>) => {
  const { textStyles, colors } = useTheme();
  return (
    <div
      className={clsx(textStyles.body, colors.textPrimary, colors.bg, 'dt-p-4')}
      {...props}
    />
  );
};

interface BroadcastProps {
  headless?: boolean;
  notificationTypeId?: string;
}

export function UnwrappedBroadcastForm(props: BroadcastProps) {
  const { dapp } = useDapp();

  // Nice error handling already exists in <DashboardWrapper />
  if (!dapp) {
    return null;
  }

  return <BroadcastForm dapp={dapp} {...props} />;
}

function Broadcast(props: BroadcastProps) {
  return (
    <Wrapper>
      <WalletStatesWrapper
        notConnectedMessage={
          <>
            Connect your Dapp’s wallet to create
            <br />
            broadcast notifications
          </>
        }
      >
        <ConnectionWrapper>
          <DashboardWrapper>
            <UnwrappedBroadcastForm {...props} />
          </DashboardWrapper>
        </ConnectionWrapper>
      </WalletStatesWrapper>
    </Wrapper>
  );
}

export default Broadcast;
