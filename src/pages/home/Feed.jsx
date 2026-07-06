import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import { showToast } from '../../redux/actions/uiActions';
import PostCard from '../../components/cards/PostCard';
import PostForm from '../../components/forms/PostForm';
import { uploadPostImage } from '../../services/storageService';
import Skeleton from '../../components/globals/Skeleton';



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

  const allPosts = [...posts]
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
