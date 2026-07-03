import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import { showToast } from '../../redux/actions/uiActions';
import PostCard from '../../components/cards/PostCard';
import PostForm from '../../components/forms/PostForm';
import { uploadPostImage } from '../../services/storageService';
import Skeleton from '../../components/globals/Skeleton';

const dummyPosts = [
  { id: 'dummy-1', authorId: 'dummy', authorName: 'Sarah Chen', authorPhoto: null, category: 'technology', content: 'AI is transforming how we build for the web. From intelligent code completion to automated accessibility audits, the tools we use are becoming smarter by the day. I believe the next frontier is AI-assisted UX design — imagine describing an interaction pattern in plain English and watching it come to life.', title: 'The Future of AI in Web Development', tags: ['ai', 'webdev', 'future'], reactions: { '❤️': 142, '🔥': 88, '👍': 112 }, reactionCount: 342, views: 1284, commentCount: 28, createdAt: { toMillis: () => Date.now() - 3 * 3600000 } },
  { id: 'dummy-2', authorId: 'dummy', authorName: 'Marcus Johnson', authorPhoto: null, category: 'technology', content: 'After spending six months with Rust, I can confidently say it\'s worth the hype. The type system catches bugs that would slip through in JavaScript, and the performance is unreal. WASM compilation makes it a natural fit for web development.', title: 'Rust for Frontend Devs in 2026', tags: ['rust', 'wasm', 'frontend'], reactions: { '❤️': 96, '🔥': 120, '👍': 40 }, reactionCount: 256, views: 972, commentCount: 31, createdAt: { toMillis: () => Date.now() - 5 * 3600000 } },
  { id: 'dummy-3', authorId: 'dummy', authorName: 'Emily Watson', authorPhoto: null, category: 'technology', content: 'Container queries solve one of the biggest pain points in responsive design. No more media queries based on viewport — components can adapt to their parent container. This changes everything for component libraries.', title: 'CSS Container Queries Are Finally Here', tags: ['css', 'responsive', 'design'], reactions: { '❤️': 72, '🔥': 45, '👍': 72 }, reactionCount: 189, views: 845, commentCount: 14, createdAt: { toMillis: () => Date.now() - 8 * 3600000 } },
  { id: 'dummy-4', authorId: 'dummy', authorName: 'David Kim', authorPhoto: null, category: 'technology', content: 'A design system is more than a component library — it\'s a shared language between design and engineering. Here\'s how we built ours from scratch, including tokens, documentation, and adoption strategies.', title: 'Building a Design System with React', tags: ['design-system', 'react', 'frontend'], reactions: { '❤️': 88, '🔥': 34, '👍': 45 }, reactionCount: 167, views: 703, commentCount: 19, createdAt: { toMillis: () => Date.now() - 12 * 3600000 } },
  { id: 'dummy-5', authorId: 'dummy', authorName: 'Alex Rivera', authorPhoto: null, category: 'technology', content: 'Edge computing isn\'t just about latency — it\'s about where your code runs. With edge functions, you can personalize content, handle authentication, and process data closer to your users than ever before.', title: 'Why Edge Computing Matters Now', tags: ['edge', 'cloud', 'performance'], reactions: { '❤️': 54, '🔥': 28, '👍': 52 }, reactionCount: 134, views: 612, commentCount: 11, createdAt: { toMillis: () => Date.now() - 24 * 3600000 } },
];

const Feed = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { posts, loading, error, createPost, updatePost, deletePost, reactToPost, removeReaction, addComment } = usePosts();

  const [creating, setCreating] = useState(false);
  const [localReactions, setLocalReactions] = useState({});
  const [localComments, setLocalComments] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => { document.title = 'Feed | Spark'; }, []);

  useEffect(() => {
    if (error) dispatch(showToast(error, 'error'));
  }, [error, dispatch]);

  const allPosts = [...dummyPosts, ...posts]
    .filter((p) => !categoryFilter || p.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'popular') {
        const aScore = (a.reactionCount || 0) + (a.viewCount || 0);
        const bScore = (b.reactionCount || 0) + (b.viewCount || 0);
        return bScore - aScore;
      }
      if (sortBy === 'reactions') {
        return (b.reactionCount || 0) - (a.reactionCount || 0);
      }
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

  const handleCreatePost = async (data) => {
    setCreating(true);
    try {
      const post = await createPost({
        title: data.title,
        content: data.content,
        tags: data.tags,
        category: data.category,
        image: '',
        authorId: user?.uid,
        authorName: user?.displayName || user?.name,
        authorPhoto: user?.photoURL,
      });
      const postId = post.id;
      if (data.image) {
        uploadPostImage(postId, data.image)
          .then((image) => updatePost(postId, { image }))
          .catch(() => dispatch(showToast('Image upload failed', 'warning')));
      }
      dispatch(showToast('Post created!', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    } finally {
      setCreating(false);
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

  const handleReact = async (id, emoji, isRemove) => {
    if (isRemove) {
      setLocalReactions(prev => {
        const existing = prev[id] ? { ...prev[id] } : {};
        existing[emoji] = Math.max(0, (existing[emoji] || 0) - 1);
        return { ...prev, [id]: existing };
      });
      try { await removeReaction(id, emoji); } catch (err) {}
    } else {
      setLocalReactions(prev => {
        const existing = prev[id] ? { ...prev[id] } : {};
        existing[emoji] = (existing[emoji] || 0) + 1;
        return { ...prev, [id]: existing };
      });
      try { await reactToPost(id, emoji); } catch (err) {}
    }
  };

  const handleAddComment = (postId, text) => {
    const comment = { id: Date.now().toString(), author: user?.displayName || user?.name || 'You', authorId: user?.uid, text, time: new Date().toISOString() };
    setLocalComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
    try { addComment(postId, { authorName: user?.displayName || user?.name || 'Anonymous', authorId: user?.uid, authorPhoto: user?.photoURL || '', content: text }); } catch (err) {}
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Feed</h1>
        <p className="feed-subtitle">See what's happening in your community</p>
      </div>

      <PostForm onSubmit={handleCreatePost} isLoading={creating} />

      <div className="feed-filters">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="feed-select"
          aria-label="Sort posts"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="reactions">Most Reactions</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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

      {loading && !creating ? (
        <div className="feed-skeleton">
          <Skeleton variant="post" count={3} />
        </div>
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

export default Feed;
