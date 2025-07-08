export interface Application {
  id: string;
  name: string;
  icon?: string;
}

export type SubscriptableChannelType = 'IN_APP' | 'EMAIL' | 'TELEGRAM';

export type ExternalChannelType = Extract<
  SubscriptableChannelType,
  'EMAIL' | 'TELEGRAM'
>;

export interface SubscriberChannel {
  id: string;
  type: ExternalChannelType;
  value: string;
  verified: boolean;
  subscribed: boolean;
  subscribedApps?: Application[];
}

export type SubscriberChannels = {
  [channelType in ExternalChannelType]?: SubscriberChannel;
};

export interface Topic {
  id: string;
  name: string;
  description?: string;
  slug: string;
  subscribed: boolean;
}

export type HistoricalTopic = Pick<Topic, 'id' | 'name' | 'slug'>;
