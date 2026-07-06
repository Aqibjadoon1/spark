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
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderRadius: 12,
    }}>
      {u.photoURL ? (
        <img src={u.photoURL} alt={u.displayName || u.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7B4DFF, var(--border-medium))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {(u.displayName || u.name || '?').charAt(0).toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {u.displayName || u.name || 'Unknown'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-placeholder)' }}>{u.email || ''}</div>
      </div>
      {showChat && (
        <button
          onClick={() => handleStartChat(u.uid)}
          style={{
            padding: '6px 14px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #7B4DFF, #A15CFF)',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
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
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #7B4DFF, #FF3C9D)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,70,180,0.20)',
          }}
        >
          + Add Friend
        </button>
      </div>

      {friendRequests.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--color-text-primary)' }}>
            Friend Requests ({friendRequests.length})
          </h2>
          <div style={{ background: 'var(--bg-glass)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            {friendRequests.map((u) => (
              <div key={u.uid} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              }}>
                {u.photoURL ? (
                  <img src={u.photoURL} alt={u.displayName || u.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7B4DFF, var(--border-medium))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {(u.displayName || u.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {u.displayName || u.name || 'Unknown'}
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(u.uid)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #7B4DFF, #A15CFF)',
                    color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(u.uid)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-light)',
                    background: 'transparent', color: 'var(--color-text-subtitle)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Decline
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--color-text-primary)' }}>
          My Friends ({myFriends.length})
        </h2>
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
          <div style={{ background: 'var(--bg-glass)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            {myFriends.map((u) => (
              <UserRow key={u.uid} u={u} showChat />
            ))}
          </div>
        )}
      </section>

      {showAddModal && (
        <div
          onClick={() => { setShowAddModal(false); setEmailInput(''); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)', borderRadius: 20, padding: 24,
              width: 380,
              border: '1px solid var(--border-light)',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text-primary)' }}>Add Friend</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-placeholder)', margin: '0 0 16px' }}>
              Enter your friend's email address to send them a friend request
            </p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendRequest(); }}
              placeholder="friend@email.com"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, marginBottom: 16,
                background: 'var(--bg-surface-raised)', border: '1px solid var(--border-light)',
                color: 'var(--color-text-primary)', fontSize: 13, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowAddModal(false); setEmailInput(''); }}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border-light)',
                  background: 'transparent', color: 'var(--color-text-subtitle)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!emailInput.trim()}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: !emailInput.trim() ? 'var(--border-light)' : 'linear-gradient(135deg, #7B4DFF, #FF3C9D)',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: emailInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
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
