import { useChannels, useTopics } from '@dialectlabs/react-sdk';
import { ReactNode } from 'react';
import { Tab, TabList, Tabs } from '../../core';
import { AppInfo } from './AppInfo';
import { Channels } from './Channels';
import { NotificationTypes } from './NotificationTypes';
import { SettingsLoading } from './SettingsLoading';

export const Settings = ({
  renderAdditionalSettingsUi,
}: {
  renderAdditionalSettingsUi?: (args: Record<string, never>) => ReactNode;
}) => {
  const { topics, isLoading: isLoadingTopics } = useTopics();
  const isAppWithTopics = topics.length > 0;

  // todo: figure out a way to populate useChannels with types, make 1 api call instead of 2 similar ones
  const { isLoading: isLoadingEmailChannel } = useChannels({ type: 'EMAIL' });
  const { isLoading: isLoadingTelegramChannel } = useChannels({
    type: 'TELEGRAM',
  });

  const isLoading =
    isLoadingEmailChannel || isLoadingTelegramChannel || isLoadingTopics;

  return isLoading ? (
    <SettingsLoading />
  ) : (
    <section className="dt-flex dt-h-full dt-flex-col">
      <Tabs defaultTab={isAppWithTopics ? 'topics' : 'channels'}>
        {isAppWithTopics && (
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
        )}
        <section className="dt-relative dt-min-h-0 dt-flex-1 dt-overflow-y-scroll dt-pb-12">
          {isAppWithTopics && (
            <Tab name="topics">
              <section className="dt-px-3 dt-py-4">
                <NotificationTypes />
              </section>
            </Tab>
          )}
          <Tab name="channels">
            <section className="dt-py-4">
              <Channels
                renderAdditionalSettingsUi={renderAdditionalSettingsUi}
              />
            </section>
          </Tab>
        </section>
        <AppInfo />
      </Tabs>
    </section>
  );
};
