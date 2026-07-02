import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/timestampUtils';
import { truncateText, formatNumber } from '../../utils/formatUtils';
import Avatar from '../globals/Avatar';

const TrendingCard = memo(({ post, rank = 0 }) => {
  const navigate = useNavigate();

  if (!post) return null;

  const rankColors = {
    1: 'bg-yellow text-dark',
    2: 'bg-lime text-dark',
    3: 'bg-red text-[#191A23] dark:text-white',
  };

  const rankLabel = rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`;

  return (
    <article
      className="bg-[#F3F3F3] dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[45px] p-4 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all duration-200 cursor-pointer flex gap-4"
      onClick={() => navigate(`/post/${post.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/post/${post.id}`); }}
      tabIndex={0}
      role="article"
      aria-label={`Trending #${rank}: ${post.title}`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${rankColors[rank] || 'bg-gray-200 dark:bg-dark-border text-gray-500 dark:text-text-muted'}`}>
        {rankLabel}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar src={post.authorPhoto} name={post.authorName} size="sm" />
          <span className="text-sm font-medium text-[#191A23] dark:text-white truncate">{post.authorName}</span>
          <span className="text-xs text-gray-500 dark:text-text-muted">{timeAgo(post.createdAt)}</span>
        </div>
        <p className="text-sm font-semibold text-[#191A23] dark:text-white truncate">{post.title}</p>
        <p className="text-xs text-gray-400 dark:text-text-gray mt-0.5">{truncateText(post.content, 80)}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-text-muted">
          <span>🔥 {formatNumber(post.reactionCount || 0)}</span>
          <span>💬 {formatNumber(post.commentsCount || 0)}</span>
        </div>
      </div>
    </article>
  );
});

export default TrendingCard;
