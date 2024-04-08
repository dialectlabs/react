export interface Message {
  id: number;
  text: string;
  metadata?: {
    notificationTypeHumanReadableId?: string;
    title?: string;
    actions?: { url?: string; label?: string }[];
  };
  timestamp: Date;
}
