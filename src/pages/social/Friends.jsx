import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { showToast } from '../../redux/actions/uiActions';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../../services/userService';
import { createConversation } from '../../services/messageService';
import { createNotification } from '../../services/notificationService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseSDK';
import { COLLECTIONS } from '../../constants/firestoreCollections';
import EmptyState from '../../components/feedback/EmptyState';

const Friends = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => { document.title = 'Friends | Elite Social'; }, []);

  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => { map[u.uid] = u; });
    return map;
  }, [users]);

  const myFriends = useMemo(() => {
    if (!user?.friends) return [];
    return user.friends.map((uid) => userMap[uid]).filter(Boolean);
  }, [user?.friends, userMap]);

  const friendRequests = useMemo(() => {
    if (!user?.friendRequests) return [];
    return user.friendRequests.map((uid) => userMap[uid]).filter(Boolean);
  }, [user?.friendRequests, userMap]);

  const findUserByEmail = (email) => {
    if (!users.length) return null;
    return users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase() && u.uid !== user?.uid
    );
  };

  const handleSendRequest = async () => {
    const target = findUserByEmail(emailInput);
    if (!target) {
      dispatch(showToast('No user found with that email', 'error'));
      return;
    }
    if (user?.friends?.includes(target.uid)) {
      dispatch(showToast('Already friends with this user', 'warning'));
      return;
    }
    try {
      await sendFriendRequest(user.uid, target.uid);
      createNotification({
        userId: target.uid,
        type: 'follow',
        fromUserId: user.uid,
        fromUserName: user.displayName || user.name,
        fromUserPhoto: user.photoURL || '',
        targetType: 'user',
        message: 'sent you a friend request',
      }).catch(() => {});
      dispatch(showToast(`Friend request sent to ${target.displayName || target.name}`, 'success'));
      setEmailInput('');
      setShowAddModal(false);
    } catch (err) {
      dispatch(showToast(err.message || 'Failed to send request', 'error'));
    }
  };

  const handleAccept = async (fromUid) => {
    try {
      await acceptFriendRequest(user.uid, fromUid);
      const requester = userMap[fromUid];
      if (requester) {
        createNotification({
          userId: fromUid,
          type: 'follow',
          fromUserId: user.uid,
          fromUserName: user.displayName || user.name,
          fromUserPhoto: user.photoURL || '',
          targetType: 'user',
          message: 'accepted your friend request',
        }).catch(() => {});
      }
      dispatch(showToast('Friend request accepted', 'success'));
    } catch (err) {
      dispatch(showToast(err.message || 'Failed to accept', 'error'));
    }
  };

  const handleReject = async (fromUid) => {
    try {
      await rejectFriendRequest(user.uid, fromUid);
      dispatch(showToast('Friend request declined', 'info'));
    } catch (err) {
      dispatch(showToast(err.message || 'Failed to decline', 'error'));
    }
  };

  const handleStartChat = async (targetUid) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.CONVERSATIONS),
        where('participants', 'array-contains', user.uid)
      );
      const snap = await getDocs(q);
      const existing = snap.docs.find((d) => {
        const data = d.data();
        return data.participants.length === 2 && data.participants.includes(targetUid);
      });
      if (existing) {
        navigate(`/messages?conv=${existing.id}`);
        return;
      }
      const docRef = await createConversation([user.uid, targetUid]);
      navigate(`/messages?conv=${docRef.id}`);
    } catch (err) {
      dispatch(showToast('Failed to start conversation', 'error'));
    }
  };

  const UserRow = ({ u, showChat }) => (
    <div className="friend-row">
      {u.photoURL ? (
        <img src={u.photoURL} alt={u.displayName || u.name} className="friend-avatar" />
      ) : (
        <div className="friend-avatar">
          {(u.displayName || u.name || '?').charAt(0).toUpperCase()}
        </div>
      )}
      <div className="friend-info">
        <div className="friend-name">{u.displayName || u.name || 'Unknown'}</div>
        <div className="friend-mutual">{u.email || ''}</div>
      </div>
      {showChat && (
        <button onClick={() => handleStartChat(u.uid)} className="friend-message-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          Message
        </button>
      )}
    </div>
  );

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Friends</h1>
        <p className="feed-subtitle">Manage your connections</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          + Add Friend
        </button>
      </div>

      {friendRequests.length > 0 && (
        <section className="friend-section">
          <h2 className="friend-section-title">Friend Requests ({friendRequests.length})</h2>
          <div className="friend-list-card">
            {friendRequests.map((u) => (
              <div key={u.uid} className="friend-row">
                {u.photoURL ? (
                  <img src={u.photoURL} alt={u.displayName || u.name} className="friend-avatar" />
                ) : (
                  <div className="friend-avatar">
                    {(u.displayName || u.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="friend-info">
                  <div className="friend-name">{u.displayName || u.name || 'Unknown'}</div>
                </div>
                <button onClick={() => handleAccept(u.uid)} className="btn btn-sm btn-primary" style={{ borderRadius: 8 }}>
                  Accept
                </button>
                <button onClick={() => handleReject(u.uid)} className="btn btn-sm btn-ghost" style={{ borderRadius: 8 }}>
                  Decline
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="friend-section">
        <h2 className="friend-section-title">My Friends ({myFriends.length})</h2>
        {myFriends.length === 0 ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
            title="No friends yet"
            description="Add friends by email to start connecting"
          />
        ) : (
          <div className="friend-list-card">
            {myFriends.map((u) => (
              <UserRow key={u.uid} u={u} showChat />
            ))}
          </div>
        )}
      </section>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => { setShowAddModal(false); setEmailInput(''); }}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Friend</h2>
              <button className="modal-close" onClick={() => { setShowAddModal(false); setEmailInput(''); }}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--color-text-placeholder)', marginBottom: 16 }}>
                Enter your friend's email address to send them a friend request
              </p>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendRequest(); }}
                placeholder="friend@email.com"
                className="cp-input"
                style={{ height: 48 }}
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => { setShowAddModal(false); setEmailInput(''); }} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleSendRequest} disabled={!emailInput.trim()} className="btn btn-primary">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
