import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseSDK';
import { COLLECTIONS } from '../../constants/firestoreCollections';
import useUsers from '../../hooks/useUsers';
import useAuth from '../../hooks/useAuth';
import { timeAgo } from '../../utils/timestampUtils';
import { showToast } from '../../redux/actions/uiActions';
import Avatar from '../../components/globals/Avatar';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';

const PublicProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { currentUser, loading, fetchUserById, sendFriendRequest, clearUser } = useUsers();
  const { user: authUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    document.title = profileUser ? `${profileUser.displayName} - Spark` : 'Profile - Spark';
  }, [profileUser]);

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        await fetchUserById(uid);
      } catch (err) {
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
    return () => clearUser();
  }, [uid, fetchUserById, clearUser]);

  useEffect(() => {
    if (currentUser) setProfileUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!uid) return;
    setPostsLoading(true);
    const postsRef = collection(db, COLLECTIONS.POSTS);
    const q = query(postsRef, where('authorId', '==', uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(list);
        setPostsLoading(false);
      },
      () => setPostsLoading(false),
    );
    return () => unsubscribe();
  }, [uid]);

  const isOwnProfile = authUser && authUser.uid === uid;
  const isPrivate = profileUser?.visibility === 'private';
  const isFriend = profileUser?.friends?.includes(authUser?.uid);
  const canViewFull = isOwnProfile || !isPrivate || isFriend;

  const totalReactions = useMemo(
    () => userPosts.reduce((sum, p) => sum + (p.reactionCount || 0), 0),
    [userPosts],
  );

  const handleSendRequest = useCallback(async () => {
    if (!authUser) {
      reduxDispatch(showToast('Sign in to send friend requests', 'warning'));
      return;
    }
    try {
      await sendFriendRequest(uid, authUser?.uid);
      setRequestSent(true);
      reduxDispatch(showToast('Friend request sent!', 'success'));
    } catch {
      reduxDispatch(showToast('Failed to send friend request', 'error'));
    }
  }, [authUser, uid, sendFriendRequest, reduxDispatch]);

  const handleMessage = useCallback(() => {
    reduxDispatch(showToast('Messaging coming soon', 'info'));
  }, [reduxDispatch]);

  const socialLinks = profileUser?.socialLinks || {};
  const friendCount = profileUser?.friends?.length || 0;

  if (profileLoading || loading) {
    return (
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <div className="panel-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
            <Skeleton variant="avatar" />
            <div style={{ marginTop: 16 }}>
              <Skeleton variant="text" />
            </div>
          </div>
          <Skeleton variant="text" count={4} />
        </div>
        <div style={{ marginTop: 32 }}>
          <Skeleton variant="post" count={2} />
        </div>
      </div>
    );
  }

  if (profileError || !profileUser) {
    return (
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <EmptyState
          icon={
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
          title="User not found"
          description={profileError || 'This profile does not exist or could not be loaded.'}
          actionLabel="Go Back"
          onAction={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 16 }}
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 4 }}>
            <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="panel-card" style={{ overflow: 'hidden' }}>
          <div style={{ height: 200, background: 'linear-gradient(135deg, #7B4DFF, #A15CFF, #FF3C9D)', borderRadius: '24px 24px 0 0' }} />

          <div style={{ padding: '0 24px 24px', position: 'relative' }}>
            <div style={{ display: 'flex', gap: 24, marginTop: -48, alignItems: 'flex-end' }}>
              <div style={{ position: 'relative' }}>
                <img className="profile-avatar" src={profileUser.photoURL} alt={profileUser.displayName} style={{ border: '4px solid var(--bg-page)', borderRadius: '50%' }} />
                {profileUser.online && (
                  <span style={{ position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, background: 'var(--color-online)', borderRadius: '50%', border: '3px solid var(--bg-page)' }} />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 56 }}>
                <h1 className="profile-name">{profileUser.displayName || 'Unknown User'}</h1>

                <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{userPosts.length}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>Posts</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{friendCount}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>Friends</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{totalReactions}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>Reactions</div>
                  </div>
                </div>

                {Object.values(socialLinks).some(Boolean) && (
                  <div className="profile-social-icons" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ padding: 8, opacity: 0.6 }} aria-label="Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </a>
                    )}
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ padding: 8, opacity: 0.6 }} aria-label="GitHub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: 8, opacity: 0.6 }} aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    )}
                    {socialLinks.website && (
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ padding: 8, opacity: 0.6 }} aria-label="Website">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.07l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                      </a>
                    )}
                  </div>
                )}

                {!isOwnProfile && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={handleSendRequest} disabled={requestSent || isFriend} className="btn btn-primary btn-sm">
                      {isFriend ? 'Friends' : requestSent ? 'Request Sent' : 'Send Friend Request'}
                    </button>
                    <button onClick={handleMessage} className="btn btn-secondary btn-sm">Message</button>
                  </div>
                )}

                {isOwnProfile && (
                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => navigate('/profile/edit')} className="btn btn-primary btn-sm">Edit Profile</button>
                  </div>
                )}
              </div>
            </div>

            {!canViewFull && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0', marginTop: 24, borderTop: '1px solid var(--border-light)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p style={{ fontSize: 14, opacity: 0.6, textAlign: 'center' }}>
                  This profile is private. Send a friend request to see full details.
                </p>
                {!isOwnProfile && (
                  <button onClick={handleSendRequest} disabled={requestSent} className="btn btn-primary btn-sm">
                    {requestSent ? 'Request Sent' : 'Send Friend Request'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {canViewFull && (
          <>
            <div className="profile-tabs" style={{ marginTop: 24 }}>
              <button className="profile-tab active">Posts</button>
            </div>

            <div className="profile-content-grid" style={{ marginTop: 24 }}>
              <div className="profile-left-col">
                <div className="panel-card">
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">About</h3>
                  </div>
                  {profileUser.bio && (
                    <p style={{ fontSize: 14, marginBottom: 12, opacity: 0.8 }}>{profileUser.bio}</p>
                  )}
                  {profileUser.email && (
                    <p style={{ fontSize: 13, opacity: 0.6 }}>{profileUser.email}</p>
                  )}
                </div>

                <div className="panel-card" style={{ marginTop: 16 }}>
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">Badges</h3>
                    <span className="panel-card-count">3</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span className="post-tag purple">Early Adopter</span>
                    <span className="post-tag teal">Top Contributor</span>
                    <span className="post-tag violet">Verified</span>
                  </div>
                </div>

                <div className="panel-card" style={{ marginTop: 16 }}>
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">Friends</h3>
                    <span className="panel-card-count">{friendCount}</span>
                  </div>
                  {friendCount > 0 ? (
                    <p style={{ fontSize: 13, opacity: 0.6 }}>{friendCount} friend{friendCount !== 1 ? 's' : ''} in network</p>
                  ) : (
                    <p style={{ fontSize: 13, opacity: 0.5 }}>No friends yet</p>
                  )}
                </div>
              </div>

              <div className="profile-center-col">
                {postsLoading ? (
                  <div>
                    <Skeleton variant="post" count={2} />
                  </div>
                ) : userPosts.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    }
                    title="No posts yet"
                    description={isOwnProfile ? 'Create your first post to share with the community.' : 'This user has not posted anything yet.'}
                  />
                ) : (
                  <div>
                    {userPosts.map((post) => (
                      <div className="post-card" key={post.id} style={{ marginBottom: 16 }}>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/post/${post.id}`)}
                          role="article"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/post/${post.id}`); }}
                          aria-label={`Post: ${post.title}`}
                        >
                          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{post.title}</h3>
                          <p className="post-body" style={{ marginBottom: 12 }}>{post.content}</p>
                          <span className="post-timestamp">{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-right-col">
                <div className="panel-card">
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">Stream</h3>
                  </div>
                  <p style={{ fontSize: 13, opacity: 0.5 }}>Recent activity will appear here</p>
                </div>

                <div className="panel-card" style={{ marginTop: 16 }}>
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">Photos</h3>
                  </div>
                  <p style={{ fontSize: 13, opacity: 0.5 }}>No photos yet</p>
                </div>

                <div className="panel-card" style={{ marginTop: 16 }}>
                  <div className="panel-card-header">
                    <h3 className="panel-card-title">Twitter</h3>
                  </div>
                  <p style={{ fontSize: 13, opacity: 0.5 }}>No tweets linked</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
