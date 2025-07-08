import { useChannels, useTopics } from '@dialectlabs/react-sdk';
import { ReactNode } from 'react';
import { Tab, TabList, Tabs } from '../../core';
import { useExternalProps } from '../internal/ExternalPropsProvider';
import { Channels } from './Channels';
import { NotificationTypes } from './NotificationTypes';
import { SettingsLoading } from './SettingsLoading';

export const Settings = (props: {
  renderAdditionalSettingsUi?: (args: Record<string, never>) => ReactNode;
}) => {
  const { channels } = useExternalProps();

  const { topics, isLoading: isLoadingTopics } = useTopics();
  const isAppWithTopics = topics.length > 0;

  const { isLoading: isLoadingChannels } = useChannels();

  const isLoading = isLoadingChannels || isLoadingTopics;

  return isLoading ? (
    <SettingsLoading />
  ) : (
    <Tabs defaultTab={isAppWithTopics ? 'topics' : 'channels'}>
      {isAppWithTopics && (
        <>
          <TabList
            tabs={[
              {
                name: 'topics',
                label: 'Topics',
              },
              {
                name: 'channels',
                label: 'Channels',
              },
            ]}
          />
          <Tab name="topics">
            <section className="dt-px-3 dt-py-4">
              <NotificationTypes />
            </section>
          </Tab>
        </>
      )}
      <Tab name="channels">
        <section className="dt-py-4">
          <Channels channels={channels} />
        </section>
      </Tab>
    </Tabs>
  );
};
