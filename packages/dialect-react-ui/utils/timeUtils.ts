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
