import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/timestampUtils';
import { truncateText, formatNumber } from '../../utils/formatUtils';
import Avatar from '../globals/Avatar';

const TrendingCard = memo(({ post, rank = 0 }) => {
  const navigate = useNavigate();

  if (!post) return null;

  const rankColors = {
    1: 'card-trending-rank-gold',
    2: 'card-trending-rank-silver',
    3: 'card-trending-rank-bronze',
  };

  const rankLabel = rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`;

  return (
    <article
      className="card-neubrutal flex gap-4"
      onClick={() => navigate(`/post/${post.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/post/${post.id}`); }}
      tabIndex={0}
      role="article"
      aria-label={`Trending #${rank}: ${post.title}`}
    >
      <div className={`card-trending-rank ${rankColors[rank] || 'card-trending-rank-default'}`}>
        {rankLabel}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar src={post.authorPhoto} name={post.authorName} size="sm" />
          <span className="text-sm font-medium truncate">{post.authorName}</span>
          <span className="text-xs" style={{color:'var(--color-text-muted)'}}>{timeAgo(post.createdAt)}</span>
        </div>
        <p className="text-sm font-semibold truncate">{post.title}</p>
        <p className="text-xs mt-0.5" style={{color:'var(--color-text-muted)'}}>{truncateText(post.content, 80)}</p>
        <div className="flex items-center gap-3 mt-2 text-xs" style={{color:'var(--color-text-muted)'}}>
          <span>🔥 {formatNumber(post.reactionCount || 0)}</span>
          <span>💬 {formatNumber(post.commentsCount || 0)}</span>
        </div>
      </div>
    </article>
  );
});

export default TrendingCard;
