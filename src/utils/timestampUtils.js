/**
 * @description Safely converts a Firestore Timestamp or Date to a Date object
 * @param {any} ts - Firestore Timestamp, Date, or null
 * @returns {Date|null}
 */
export function toDate(ts) {
  if (ts && typeof ts.toDate === 'function') {
    return ts.toDate();
  }
  if (ts instanceof Date) {
    return ts;
  }
  if (ts && typeof ts === 'object' && ts.seconds) {
    return new Date(ts.seconds * 1000);
  }
  return ts || null;
}

/**
 * @description Formats a date for display
 * @param {any} ts - Timestamp or Date
 * @param {string} format - 'short', 'long', 'relative'
 * @returns {string}
 */
export function formatDate(ts, format = 'short') {
  const date = toDate(ts);
  if (!date) return '';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' },
  };

  if (format === 'relative') {
    return timeAgo(ts);
  }

  return date.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * @description Returns relative time string like "2 hours ago", "3 days ago"
 * @param {any} ts - Timestamp or Date
 * @returns {string}
 */
export function timeAgo(ts) {
  const date = toDate(ts);
  if (!date) return '';

  const now = new Date();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}
