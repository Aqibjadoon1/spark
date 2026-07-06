import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/timestampUtils';
import { truncateText, formatNumber, linkifyText } from '../../utils/formatUtils';
import Avatar from '../globals/Avatar';
import useUserReactions from '../../hooks/useUserReactions';

const REACTION_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '😢', '😡'];

const PostCard = ({ post, localComments, onReact, onComment, onAddComment, onDelete, onEdit, currentUserId, onBookmark, isBookmarked }) => {
  const navigate = useNavigate();
  const { hasReacted, toggleReaction } = useUserReactions(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const likeRef = useRef(null);
  const pickerRef = useRef(null);
  const longPressTimer = useRef(null);

  if (!post) return null;

  const {
    id, authorId, authorName, authorPhoto,
    title, content, tags = [],
    reactions: postReactions = {},
    views, createdAt,
    image,
  } = post;

  const totalReactions = Object.values(postReactions).reduce((a, b) => a + b, 0);
  const comments = localComments || [];
  const isAuthor = currentUserId && currentUserId === authorId;


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

  const closeReactionPicker = useCallback(() => {
    setShowReactions(false);
    setLongPress(false);
  }, []);

  useEffect(() => {
    if (!showReactions) return;
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target) &&
          likeRef.current && !likeRef.current.contains(e.target)) {
        closeReactionPicker();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReactions, closeReactionPicker]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (showReactions) {
      closeReactionPicker();
      return;
    }
    handleReactClick(e, '👍');
  };

  const handleReactionHover = () => {
    setShowReactions(true);
  };

  const handleReactionLeave = () => {
    setTimeout(() => {
      if (!pickerRef.current?.matches(':hover')) {
        setShowReactions(false);
      }
    }, 150);
  };

  const handlePickerSelect = (e, emoji) => {
    handleReactClick(e, emoji);
    closeReactionPicker();
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowReactions(true);
      setLongPress(true);
    }, 500);
  };

  const handleTouchEnd = (e) => {
    clearTimeout(longPressTimer.current);
    if (longPress) {
      setLongPress(false);
      return;
    }
    handleLikeClick(e);
  };

  const handleTouchMove = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onAddComment?.(id, commentInput.trim(), authorId);
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
    const isReacted = hasReacted(id, emoji);
    toggleReaction(id, emoji);
    if (isReacted) {
      onReact?.(id, emoji, authorId, true);
    } else {
      onReact?.(id, emoji, authorId);
    }
  };

  const handleCommentToggle = (e) => {
    e.stopPropagation();
    setShowComments(prev => !prev);
  };

  return (
    <article className="pc-card" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} role="article" aria-label={`Post by ${authorName}: ${title}`}>
      <div className="pc-header">
        <div className="pc-avatar-ring">
          <Avatar src={authorPhoto} name={authorName} size="md" />
        </div>
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
        {REACTION_EMOJIS.filter((e) => (postReactions[e] || 0) > 0 || REACTION_EMOJIS.slice(0, 3).includes(e)).map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => handleReactClick(e, emoji)}
            className={`pc-reaction-btn${hasReacted(id, emoji) ? ' active' : ''}`}
            aria-label={`React with ${emoji}`}
            style={hasReacted(id, emoji) ? { background: 'rgba(123,77,255,0.15)', borderColor: 'rgba(123,77,255,0.35)' } : {}}
          >
            <span className="pc-reaction-emoji">{emoji}</span>
            <span className="pc-reaction-count">{formatNumber(postReactions[emoji] || 0)}</span>
          </button>
        ))}
        <button onClick={(e) => { e.stopPropagation(); onComment?.(id); }} className="pc-reaction-btn pc-reaction-btn--right" aria-label="View post detail">
          💬 <span className="pc-reaction-count">{formatNumber(post.commentsCount || 0)}</span>
        </button>
      </div>

      <div className="pc-stats-bar">
        <span className="pc-stat">{formatNumber(totalReactions)} reactions</span>
        <span className="pc-stat">{formatNumber(post.commentsCount || 0)} comments</span>
      </div>

      <div className="pc-actions-bar">
        <div className="pc-like-wrap" ref={likeRef} onMouseEnter={handleReactionHover} onMouseLeave={handleReactionLeave}>
          <button onClick={handleLikeClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove} className="pc-action-btn">
            <span>👍</span> Like
          </button>
          {showReactions && (
            <div className="pc-reaction-picker" ref={pickerRef} onMouseEnter={() => setShowReactions(true)} onMouseLeave={handleReactionLeave}>
              {REACTION_EMOJIS.map((emoji, i) => (
                <button key={emoji} className={`pc-reaction-option${hasReacted(id, emoji) ? ' reacted' : ''}`} onClick={(e) => handlePickerSelect(e, emoji)} style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="pc-reaction-emoji-large">{emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleCommentToggle} className="pc-action-btn">
          <span>💬</span> Comment
        </button>
        {onBookmark && (
          <button onClick={(e) => { e.stopPropagation(); onBookmark(id); }} className="pc-action-btn" style={{ color: isBookmarked ? 'var(--color-primary-light)' : undefined }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      {showComments && (
        <div className="pc-comments-section" onClick={(e) => e.stopPropagation()}>
          <div className="pc-comments-list">
            {comments.map((c) => (
              <div key={c.id} className="pc-comment">
                <div className="pc-comment-avatar">{c.author?.charAt(0) || '?'}</div>
                <div className="pc-comment-body">
                  <span className="pc-comment-author">{c.author}</span>
                  <p className="pc-comment-text">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
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
