import { useDapp } from '@dialectlabs/react-sdk';
import { Centered } from '../../components/common';
import { A } from '../../components/common/preflighted';

// Only renders children if PK has access to some dapp

interface DashboardWrapperProps {
  children: JSX.Element;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const {
    dapp,
    isFetching: isFetchingDapp,
    errorFetching: errorFetchingDapp,
  } = useDapp();

  if (errorFetchingDapp) {
    return (
      <Centered className="dt-text-center">
        Failed to fetch your dapps: {errorFetchingDapp.message}
      </Centered>
    );
  }

  if (isFetchingDapp) {
    return <Centered>Loading your dapps...</Centered>;
  }

  if (!dapp) {
    return (
      <Centered className="dt-text-center">
        <span>
          This wallet is not yet registered.{' '}
          <A
            target="_blank"
            href={
              'https://docs.dialect.to/documentation/notifications-and-monitoring/registering-your-dapp'
            }
            className="dt-underline"
          >
            Register
          </A>{' '}
          and get started sending messages
        </span>
      </Centered>
    );
  }

  return children;
}
