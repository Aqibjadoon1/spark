import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import usePosts from '../../hooks/usePosts';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../redux/actions/uiActions';
import PostCard from '../../components/cards/PostCard';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';

const dummyPosts = [
  { id: 'explore-dummy-1', authorId: 'dummy', authorName: 'Sarah Chen', authorPhoto: null, category: 'technology', title: 'The Future of AI in Web Development', content: 'AI is transforming how we build for the web. From intelligent code completion to automated accessibility audits, the tools we use are becoming smarter by the day.', tags: ['ai', 'webdev', 'future'], reactions: { '❤️': 142, '🔥': 88, '👍': 112 }, reactionCount: 342, viewCount: 1284, commentCount: 28, createdAt: { toMillis: () => Date.now() - 3 * 3600000 } },
  { id: 'explore-dummy-2', authorId: 'dummy', authorName: 'Marcus Johnson', authorPhoto: null, category: 'technology', title: 'Rust for Frontend Devs in 2026', content: 'After spending six months with Rust, I can confidently say it\'s worth the hype. The type system catches bugs that would slip through in JavaScript.', tags: ['rust', 'wasm', 'frontend'], reactions: { '❤️': 96, '🔥': 120, '👍': 40 }, reactionCount: 256, viewCount: 972, commentCount: 31, createdAt: { toMillis: () => Date.now() - 5 * 3600000 } },
  { id: 'explore-dummy-3', authorId: 'dummy', authorName: 'Emily Watson', authorPhoto: null, category: 'technology', title: 'CSS Container Queries Are Finally Here', content: 'Container queries solve one of the biggest pain points in responsive design. Components can now adapt to their parent container.', tags: ['css', 'responsive', 'design'], reactions: { '❤️': 72, '🔥': 45, '👍': 72 }, reactionCount: 189, viewCount: 845, commentCount: 14, createdAt: { toMillis: () => Date.now() - 8 * 3600000 } },
  { id: 'explore-dummy-4', authorId: 'dummy', authorName: 'David Kim', authorPhoto: null, category: 'technology', title: 'Building a Design System with React', content: 'A design system is more than a component library — it\'s a shared language between design and engineering.', tags: ['design-system', 'react', 'frontend'], reactions: { '❤️': 88, '🔥': 34, '👍': 45 }, reactionCount: 167, viewCount: 703, commentCount: 19, createdAt: { toMillis: () => Date.now() - 12 * 3600000 } },
  { id: 'explore-dummy-5', authorId: 'dummy', authorName: 'Alex Rivera', authorPhoto: null, category: 'technology', title: 'Why Edge Computing Matters Now', content: 'Edge computing isn\'t just about latency — it\'s about where your code runs.', tags: ['edge', 'cloud', 'performance'], reactions: { '❤️': 54, '🔥': 28, '👍': 52 }, reactionCount: 134, viewCount: 612, commentCount: 11, createdAt: { toMillis: () => Date.now() - 24 * 3600000 } },
];

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
  const [localReactions, setLocalReactions] = useState({});
  const [localComments, setLocalComments] = useState({});

  useEffect(() => { document.title = 'Explore | Spark'; }, []);
  useEffect(() => { if (error) dispatch(showToast(error, 'error')); }, [error, dispatch]);

  const allPosts = useMemo(() => {
    const combined = [...dummyPosts, ...posts];
    let filtered = combined.filter((p) => {
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

  const handleReact = async (id, emoji, isRemove) => {
    if (isRemove) {
      setLocalReactions(prev => {
        const existing = prev[id] ? { ...prev[id] } : {};
        existing[emoji] = Math.max(0, (existing[emoji] || 0) - 1);
        return { ...prev, [id]: existing };
      });
      try { await removeReaction(id, emoji); } catch {}
    } else {
      setLocalReactions(prev => {
        const existing = prev[id] ? { ...prev[id] } : {};
        existing[emoji] = (existing[emoji] || 0) + 1;
        return { ...prev, [id]: existing };
      });
      try { await reactToPost(id, emoji); } catch {}
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      dispatch(showToast('Post deleted', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleAddComment = (postId, text) => {
    const comment = { id: Date.now().toString(), author: user?.displayName || 'You', authorId: user?.uid, text, time: new Date().toISOString() };
    setLocalComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
    try { addComment(postId, { authorName: user?.displayName || 'Anonymous', authorId: user?.uid, authorPhoto: user?.photoURL || '', content: text }); } catch {}
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
                localReactions={localReactions[post.id]}
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