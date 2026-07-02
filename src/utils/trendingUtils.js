import { toDate } from './timestampUtils';

/**
 * @description Calculates hours since the given timestamp
 * @param {any} timestamp - Firestore Timestamp, Date, or null
 * @returns {number}
 */
function getHoursSince(timestamp) {
  const date = toDate(timestamp);
  if (!date) return 0;
  const diffMs = Date.now() - date.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60));
}

/**
 * @description Calculates trending score for a post
 * @param {Object} post - Post object with reactions, viewCount, commentsCount, createdAt
 * @returns {number} - Trending score
 */
export function calculateTrendingScore(post) {
  const reactions = post.reactionCount ||
    (post.reactions ? Object.keys(post.reactions).reduce((sum, emoji) => sum + post.reactions[emoji].length, 0) : 0);
  const views = post.viewCount || 0;
  const comments = post.commentsCount || 0;
  const hoursSincePosted = getHoursSince(post.createdAt);
  const recencyBoost = Math.max(0, 100 - hoursSincePosted * 2);
  return reactions * 3 + views * 1 + comments * 2 + recencyBoost;
}
