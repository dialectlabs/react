export interface Application {
  id: string;
  name: string;
  icon?: string;
}

export type SubscriberChannelType = 'EMAIL' | 'TELEGRAM';

export interface SubscriberChannel {
  id: string;
  type: SubscriberChannelType;
  value: string;
  verified: boolean;
  subscribed: boolean;
  subscribedApps?: Application[];
}

export type SubscriberChannels = {
  [channelType in SubscriberChannelType]?: SubscriberChannel;
};
