import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/timestampUtils';
import { truncateText, formatNumber, linkifyText } from '../../utils/formatUtils';
import Avatar from '../globals/Avatar';

const PostCard = ({ post, localReactions, localComments, onReact, onComment, onAddComment, onDelete, onEdit, currentUserId }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [myReactions, setMyReactions] = useState(new Set());

  if (!post) return null;

  const {
    id, authorId, authorName, authorPhoto,
    title, content, tags = [],
    reactions: postReactions = {},
    views, createdAt,
    image,
  } = post;

  const mergedReactions = { ...postReactions, ...(localReactions || {}) };
  const totalReactions = Object.values(mergedReactions).reduce((a, b) => a + b, 0);
  const comments = localComments || [];
  const isAuthor = currentUserId && currentUserId === authorId;
  const reactionEmojis = ['❤️', '🔥', '👍'];

  const handleClick = (e) => {
    if (e.target.closest('button') || e.target.closest('.pc-comments-section')) return;
    navigate(`/post/${id}`);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button') && !e.target.closest('input')) {
      e.preventDefault();
      navigate(`/post/${id}`);
    }
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onAddComment?.(id, commentInput.trim());
    setCommentInput('');
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleReactClick = (e, emoji) => {
    e.stopPropagation();
    const isReacted = myReactions.has(emoji);
    if (isReacted) {
      setMyReactions((prev) => { const next = new Set(prev); next.delete(emoji); return next; });
      onReact?.(id, emoji, true);
    } else {
      setMyReactions((prev) => new Set(prev).add(emoji));
      onReact?.(id, emoji);
    }
  };

  const handleCommentToggle = (e) => {
    e.stopPropagation();
    setShowComments(prev => !prev);
  };

  return (
    <article className="pc-card" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} role="article" aria-label={`Post by ${authorName}: ${title}`}>
      <div className="pc-header">
        <Avatar src={authorPhoto} name={authorName} size="md" />
        <div className="pc-header-info">
          <span className="pc-author">{authorName}</span>
          <span className="pc-time">{timeAgo(createdAt)} {views ? `· ${formatNumber(views)} views` : ''}</span>
        </div>
        {isAuthor && (
          <div className="pc-header-actions">
            <button onClick={(e) => { e.stopPropagation(); onEdit?.(post); }} className="pc-icon-btn" aria-label="Edit post">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(id); }} className="pc-icon-btn" aria-label="Delete post">🗑️</button>
          </div>
        )}
      </div>

      <h3 className="pc-title">{title}</h3>
      <p className="pc-content" dangerouslySetInnerHTML={{ __html: linkifyText(truncateText(content, 300)) }} />

      {image && (
        <div className="pc-image-wrap" style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden' }}>
          <img src={image} alt={title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12 }} loading="lazy" />
        </div>
      )}

      {tags.length > 0 && (
        <div className="pc-tags">
          {tags.map((tag) => <span key={tag} className="pc-tag">#{tag}</span>)}
        </div>
      )}

      <div className="pc-reactions-bar">
        {reactionEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => handleReactClick(e, emoji)}
            className={`pc-reaction-btn${myReactions.has(emoji) ? ' active' : ''}`}
            aria-label={`React with ${emoji}`}
            style={myReactions.has(emoji) ? { background: 'rgba(123,77,255,0.15)', borderColor: 'rgba(123,77,255,0.35)' } : {}}
          >
            <span className="pc-reaction-emoji">{emoji}</span>
            <span className="pc-reaction-count">{formatNumber(mergedReactions[emoji] || 0)}</span>
          </button>
        ))}
        <button onClick={(e) => { e.stopPropagation(); onComment?.(id); }} className="pc-reaction-btn pc-reaction-btn--right" aria-label="View post detail">
          💬 <span className="pc-reaction-count">{formatNumber(comments.length + (post.commentCount || 0))}</span>
        </button>
      </div>

      <div className="pc-stats-bar">
        <span className="pc-stat">{formatNumber(totalReactions)} reactions</span>
        <span className="pc-stat">{formatNumber(comments.length + (post.commentCount || 0))} comments</span>
      </div>

      <div className="pc-actions-bar">
        <button onClick={(e) => handleReactClick(e, '❤️')} className="pc-action-btn">
          <span>❤️</span> Like
        </button>
        <button onClick={handleCommentToggle} className="pc-action-btn">
          <span>💬</span> Comment
        </button>
      </div>

      {showComments && (
        <div className="pc-comments-section" onClick={(e) => e.stopPropagation()}>
          {comments.map((c) => (
            <div key={c.id} className="pc-comment">
              <div className="pc-comment-avatar">{c.author?.charAt(0) || '?'}</div>
              <div className="pc-comment-body">
                <span className="pc-comment-author">{c.author}</span>
                <p className="pc-comment-text">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="pc-comment-input-row">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="Write a comment..."
              className="pc-comment-input"
            />
            <button onClick={handleSendComment} disabled={!commentInput.trim()} className="pc-comment-send">
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
