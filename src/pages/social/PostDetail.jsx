import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseSDK';
import { COLLECTIONS } from '../../constants/firestoreCollections';
import usePosts from '../../hooks/usePosts';
import useAuth from '../../hooks/useAuth';
import { timeAgo } from '../../utils/timestampUtils';
import { formatNumber, linkifyText } from '../../utils/formatUtils';
import { showToast } from '../../redux/actions/uiActions';
import { trackComment } from '../../services/analyticsService';
import Avatar from '../../components/globals/Avatar';
import CommentForm from '../../components/forms/CommentForm';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { currentPost, loading, error, getPostById, reactToPost, deletePost, incrementViews } = usePosts();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [post, setPost] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    document.title = post ? `${post.title} - Spark` : 'Post - Spark';
  }, [post]);

  useEffect(() => {
    const loadPost = async () => {
      setPageLoading(true);
      try {
        const fetched = await getPostById(id);
        setPost(fetched);
        incrementViews(id);
      } catch {
      } finally {
        setPageLoading(false);
      }
    };
    loadPost();
  }, [id, getPostById, incrementViews]);

  useEffect(() => {
    if (!id) return;
    setCommentsLoading(true);
    const commentsRef = collection(db, COLLECTIONS.POSTS, id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(list);
        setCommentsLoading(false);
      },
      () => {
        setCommentsLoading(false);
      },
    );
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (currentPost) setPost(currentPost);
  }, [currentPost]);

  const handleReact = useCallback(
    async (emoji) => {
      if (!user) {
        reduxDispatch(showToast('Sign in to react', 'warning'));
        return;
      }
      try {
        await reactToPost(id, emoji);
        reduxDispatch(showToast('Reaction added', 'success'));
      } catch {
        reduxDispatch(showToast('Failed to add reaction', 'error'));
      }
    },
    [id, user, reactToPost, reduxDispatch],
  );

  const { addComment } = usePosts();

  const handleComment = useCallback(
    async ({ content }) => {
      if (!user) {
        reduxDispatch(showToast('Sign in to comment', 'warning'));
        return;
      }
      setSubmittingComment(true);
      try {
        await addComment(id, {
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous',
          authorPhoto: user.photoURL || '',
          content,
        });
        reduxDispatch(showToast('Comment added', 'success'));
        trackComment();
      } catch {
        reduxDispatch(showToast('Failed to add comment', 'error'));
      } finally {
        setSubmittingComment(false);
      }
    },
    [id, user, addComment, reduxDispatch],
  );

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deletePost(id);
      reduxDispatch(showToast('Post deleted', 'success'));
      navigate(-1);
    } catch {
      reduxDispatch(showToast('Failed to delete post', 'error'));
    }
  }, [id, deletePost, reduxDispatch, navigate]);

  if (pageLoading || loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Skeleton variant="post" count={1} />
        <div style={{ marginTop: 32 }}>
          <Skeleton variant="text" count={3} />
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <EmptyState
          icon={
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
          title="Post not found"
          description={error || 'This post may have been deleted or does not exist.'}
          actionLabel="Back to Feed"
          onAction={() => navigate('/feed')}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <EmptyState
          icon={
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
          title="Post not found"
          description="This post could not be loaded."
          actionLabel="Back to Feed"
          onAction={() => navigate('/feed')}
        />
      </div>
    );
  }

  const isAuthor = user && user.uid === post.authorId;
  const reactionEmojis = ['❤️', '🔥', '👍'];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24 }}
        aria-label="Go back"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 4 }}>
          <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="post-card">
        <div className="post-header">
          <img className="post-avatar" src={post.authorPhoto} alt={post.authorName} style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${post.authorId}`)} />
          <button className="post-author-name" onClick={() => navigate(`/profile/${post.authorId}`)} style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>{post.authorName}</button>
          <span className="post-timestamp">{timeAgo(post.createdAt)}</span>
          {isAuthor && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button
                onClick={() => navigate(`/post/${id}/edit`)}
                className="post-more-btn"
                aria-label="Edit post"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M13.3333 2.5L17.5 6.66667M2.5 17.5L7.5 16.6667L16.6667 7.5L12.5 3.33333L3.33333 12.5L2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="post-more-btn"
                aria-label="Delete post"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 5H16M7.5 5V3.5C7.5 3.22386 7.72386 3 8 3H12C12.2761 3 12.5 3.22386 12.5 3.5V5M15 7L14.5 16.5H5.5L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>{post.title}</h1>

        {post.image && (
          <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 12 }} />
          </div>
        )}

        <div className="post-body" dangerouslySetInnerHTML={{ __html: linkifyText(post.content || '') }} />

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag default">#{tag}</span>
            ))}
          </div>
        )}

        <div className="post-reactions-row">
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="post-action-btn"
              aria-label={`React with ${emoji}`}
            >
              <span>{emoji}</span>
              <span className="post-reaction-count">{formatNumber(post.reactions?.[emoji] || 0)}</span>
            </button>
          ))}
          <span className="post-meta-counts">
            {formatNumber(post.viewCount || 0)} views
          </span>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
          Comments ({comments.length})
        </h2>

        <div className="panel-card">
          <CommentForm onSubmit={handleComment} isLoading={submittingComment} />

          <div style={{ marginTop: 24 }}>
            {commentsLoading ? (
              <div style={{ marginBottom: 16 }}>
                <Skeleton variant="text" count={3} />
              </div>
            ) : comments.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: 14, padding: '24px 0', opacity: 0.6 }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{ display: 'flex', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border-light)' }}>
                  <Avatar src={comment.authorPhoto} name={comment.authorName} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <button
                        onClick={() => navigate(`/profile/${comment.authorId}`)}
                        className="post-author-name"
                        style={{ fontSize: 13 }}
                      >
                        {comment.authorName || 'Anonymous'}
                      </button>
                      <span className="post-timestamp" style={{ fontSize: 12 }}>
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, opacity: 0.7 }}>{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
