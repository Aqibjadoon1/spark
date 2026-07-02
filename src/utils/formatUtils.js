/**
 * @description Formats a number for display (1000 -> "1K", 1000000 -> "1M")
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return num.toString();
}

/**
 * @description Truncates text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * @description Capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
/**
 * @description Converts URLs in text to clickable anchor tags
 * @param {string} text
 * @returns {string}
 */
export function linkifyText(text) {
  if (!text) return '';
  const urlPattern = /(\b(https?|ftp):\/\/[^\s<]+[^\s<.,;:!?)'"}\]])/gi;
  return text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-light); font-weight: 600;">${url}</a>`;
  });
}

export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @description Converts a string to a URL-friendly slug
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
