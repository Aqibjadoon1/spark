import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import usePosts from '../../hooks/usePosts';
import { showToast } from '../../redux/actions/uiActions';
import PostCard from '../../components/cards/PostCard';
import PostForm from '../../components/forms/PostForm';
import { uploadPostImage } from '../../services/storageService';
import { trackPostCreated } from '../../services/analyticsService';
import { createNotification } from '../../services/notificationService';
import { addBookmark, removeBookmark } from '../../services/bookmarkService';
import Skeleton from '../../components/globals/Skeleton';



const Feed = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { users } = useUsers();
  const { posts, loading, error, createPost, updatePost, deletePost, reactToPost, removeReaction, addComment } = usePosts();

  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [localComments, setLocalComments] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => { document.title = 'Feed | Elite Social'; }, []);

  useEffect(() => {
    if (error) dispatch(showToast(error, 'error'));
  }, [error, dispatch]);

  const currentUserProfile = users.find((u) => u.uid === user?.uid) || {};
  const bookmarkedPostIds = currentUserProfile.bookmarks || [];

  const handleBookmark = async (postId) => {
    if (!user?.uid) return;
    if (bookmarkedPostIds.includes(postId)) {
      await removeBookmark(user.uid, postId);
    } else {
      await addBookmark(user.uid, postId);
    }
  };

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
      if (data.category) trackPostCreated(data.category);
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

  const getCollection = (postId) => posts.find(p => p.id === postId)?._collection;

  const handleDelete = async (id) => {
    try {
      await deletePost(id, getCollection(id));
      dispatch(showToast('Post deleted', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleReact = async (id, emoji, authorId, isRemove) => {
    const col = getCollection(id);
    if (isRemove) {
      try { await removeReaction(id, emoji, col); } catch (err) {}
    } else {
      try {
        await reactToPost(id, emoji, col);
        if (authorId && authorId !== user?.uid) {
          createNotification({
            userId: authorId,
            type: 'like',
            fromUserId: user?.uid,
            fromUserName: user?.displayName || user?.name,
            fromUserPhoto: user?.photoURL || '',
            targetId: id,
            targetType: 'post',
            message: 'liked your post',
          }).catch(() => {});
        }
      } catch (err) {}
    }
  };

  const handleAddComment = (postId, text, authorId) => {
    const col = getCollection(postId);
    const comment = { id: Date.now().toString(), author: user?.displayName || user?.name || 'You', authorId: user?.uid, text, time: new Date().toISOString() };
    setLocalComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
    try {
      addComment(postId, { authorName: user?.displayName || user?.name || 'Anonymous', authorId: user?.uid, authorPhoto: user?.photoURL || '', content: text }, col);
      if (authorId && authorId !== user?.uid) {
        createNotification({
          userId: authorId,
          type: 'comment',
          fromUserId: user?.uid,
          fromUserName: user?.displayName || user?.name,
          fromUserPhoto: user?.photoURL || '',
          targetId: postId,
          targetType: 'post',
          message: `commented: "${text.slice(0, 60)}"`,
        }).catch(() => {});
      }
    } catch (err) {}
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Feed</h1>
        <p className="feed-subtitle">See what's happening in your community</p>
      </div>

      <div className="feed-form-section">
        <button className="feed-form-trigger" onClick={() => setShowForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Want to share your ideas?
        </button>
        <div className={`feed-form-drawer ${showForm ? 'feed-form-drawer--open' : ''}`}>
          <div className="feed-form-drawer-header">
            <h3>Create Post</h3>
            <button className="feed-form-close" onClick={() => setShowForm(false)} aria-label="Close form">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <PostForm onSubmit={handleCreatePost} isLoading={creating} />
        </div>
        {showForm && <div className="feed-form-backdrop" onClick={() => setShowForm(false)} />}
      </div>

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
              <PostCard
                key={post.id}
                post={post}
                localComments={localComments[post.id]}
                onReact={handleReact}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
                currentUserId={user?.uid}
                isBookmarked={bookmarkedPostIds.includes(post.id)}
                onBookmark={handleBookmark}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
