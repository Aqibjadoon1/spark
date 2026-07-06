import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import usePosts from '../../hooks/usePosts';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../redux/actions/uiActions';
import PostCard from '../../components/cards/PostCard';
import { createNotification } from '../../services/notificationService';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
];

const ExplorePosts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { posts, loading, error, deletePost, reactToPost, removeReaction, addComment } = usePosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [localComments, setLocalComments] = useState({});

  useEffect(() => { document.title = 'Explore | Elite Social'; }, []);
  useEffect(() => { if (error) dispatch(showToast(error, 'error')); }, [error, dispatch]);

  const allPosts = useMemo(() => {
    let filtered = posts.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.title?.toLowerCase().includes(q) &&
            !p.content?.toLowerCase().includes(q) &&
            !p.authorName?.toLowerCase().includes(q) &&
            !p.tags?.some((t) => t.toLowerCase().includes(q))) return false;
      }
      if (categoryFilter && p.category !== categoryFilter) return false;
      return true;
    });
    filtered.sort((a, b) => {
      if (sortBy === 'trending') {
        const scoreA = (a.reactionCount || 0) * 2 + (a.viewCount || 0);
        const scoreB = (b.reactionCount || 0) * 2 + (b.viewCount || 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'popular') return (b.reactionCount || 0) - (a.reactionCount || 0);
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
    return filtered;
  }, [posts, searchQuery, sortBy, categoryFilter]);

  const getCollection = (postId) => posts.find(p => p.id === postId)?._collection;

  const handleReact = async (id, emoji, authorId, isRemove) => {
    const col = getCollection(id);
    if (isRemove) {
      try { await removeReaction(id, emoji, col); } catch {}
    } else {
      try {
        await reactToPost(id, emoji, col);
        if (authorId && authorId !== user?.uid) {
          createNotification({
            userId: authorId,
            type: 'like',
            fromUserId: user?.uid,
            fromUserName: user?.displayName,
            fromUserPhoto: user?.photoURL || '',
            targetId: id,
            targetType: 'post',
            message: 'liked your post',
          }).catch(() => {});
        }
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id, getCollection(id));
      dispatch(showToast('Post deleted', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleAddComment = (postId, text, authorId) => {
    const col = getCollection(postId);
    const comment = { id: Date.now().toString(), author: user?.displayName || 'You', authorId: user?.uid, text, time: new Date().toISOString() };
    setLocalComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
    try {
      addComment(postId, { authorName: user?.displayName || 'Anonymous', authorId: user?.uid, authorPhoto: user?.photoURL || '', content: text }, col);
      if (authorId && authorId !== user?.uid) {
        createNotification({
          userId: authorId,
          type: 'comment',
          fromUserId: user?.uid,
          fromUserName: user?.displayName,
          fromUserPhoto: user?.photoURL || '',
          targetId: postId,
          targetType: 'post',
          message: `commented: "${text.slice(0, 60)}"`,
        }).catch(() => {});
      }
    } catch {}
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Explore</h1>
        <p className="feed-subtitle">Discover trending posts from the community</p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-placeholder)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text" placeholder="Search posts by title, author, content, or tags..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-3)',
              borderRadius: '12px', fontSize: '0.875rem',
              color: 'var(--color-text-primary)', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--bg-glass-3)')}
          />
        </div>
        <div className="feed-filters">
          <select
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="feed-select"
            aria-label="Sort posts"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="feed-select"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="feed-skeleton"><Skeleton variant="post" count={3} /></div>
      ) : allPosts.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          }
          title="No posts found"
          description={searchQuery ? 'Try a different search term or filter' : 'No posts available yet. Be the first to create one!'}
          actionLabel={searchQuery ? '' : 'Create Post'}
          onAction={searchQuery ? undefined : () => navigate('/feed')}
        />
      ) : (
        <div className="feed-timeline">
          {allPosts.map((post) => (
            <div className="feed-post-wrapper" key={post.id}>
              <PostCard
                post={post}
                localComments={localComments[post.id]}
                onReact={handleReact}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
                currentUserId={user?.uid}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePosts;