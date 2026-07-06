import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import usePosts from '../../hooks/usePosts';
import PostCard from '../../components/cards/PostCard';
import EmptyState from '../../components/feedback/EmptyState';
import { addBookmark, removeBookmark } from '../../services/bookmarkService';

const Bookmarks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useUsers();
  const { posts } = usePosts();

  useEffect(() => { document.title = 'Bookmarks | Elite Social'; }, []);

  const currentUserProfile = useMemo(() => {
    if (!user?.uid || !users.length) return null;
    return users.find((u) => u.uid === user.uid) || user;
  }, [user, users]);

  const bookmarkedPostIds = currentUserProfile?.bookmarks || [];

  const bookmarkedPosts = useMemo(() => {
    return posts.filter((p) => bookmarkedPostIds.includes(p.id));
  }, [posts, bookmarkedPostIds]);

  const handleBookmark = async (postId) => {
    if (!user?.uid) return;
    if (bookmarkedPostIds.includes(postId)) {
      await removeBookmark(user.uid, postId);
    } else {
      await addBookmark(user.uid, postId);
    }
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Bookmarks</h1>
        <p className="feed-subtitle">Posts you've saved for later</p>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
          title="No bookmarks yet"
          description="Save posts you like to read them later"
        />
      ) : (
        <div className="feed-timeline">
          {bookmarkedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
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

export default Bookmarks;
