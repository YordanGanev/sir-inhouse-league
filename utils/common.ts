export const getPlaceholderImage = (signature: string) =>
  `https://i0.wp.com/cdn.auth0.com/avatars/${signature}.png?ssl=1`;

export const passTimeString = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? "a year ago" : years + " years ago";
  } else if (months > 0) {
    return months === 1 ? "a month ago" : months + " months ago";
  } else if (days > 0) {
    return days === 1 ? "a day ago" : days + " days ago";
  } else if (hours > 0) {
    return hours === 1 ? "an hour ago" : hours + " hours ago";
  } else {
    return minutes <= 1 ? "a minute ago" : minutes + " minutes ago";
  }
};

export const playerSortLables = [
  "Score",
  "Streak",
  "Games",
  "Wins",
  "WR %",
  "GPM",
  "XPM",
  "KDA",
  "LH",
  "HD",
  "TD",
  "HH",
];
