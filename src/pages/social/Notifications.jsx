import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { subscribeToNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';

const iconMap = {
  like: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="#FF3C9D" stroke="#FF3C9D" strokeWidth="2"/></svg>,
  follow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="#7B4DFF" strokeWidth="2"/></svg>,
  comment: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#A15CFF" strokeWidth="2"/></svg>,
  mention: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke="#4A6CFF" strokeWidth="2"/></svg>,
  system: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#A15CFF" strokeWidth="2"/></svg>,
};

const NOTIF_COLORS = {
  like: '#FF3C9D',
  follow: '#7B4DFF',
  comment: '#A15CFF',
  mention: '#4A6CFF',
  system: '#A15CFF',
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => { document.title = 'Notifications | Spark'; }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToNotifications(user.uid, setNotifications);
    return () => unsub();
  }, [user?.uid]);

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const unreadAll = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    try { await markNotificationRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    try { await markAllNotificationsRead(user?.uid); } catch {}
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Notifications</h1>
        <p className="feed-subtitle">Stay updated with your community</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'like', 'follow', 'comment', 'mention', 'system'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-light)',
              background: activeFilter === type ? 'linear-gradient(135deg, #7B4DFF, #FF3C9D)' : 'var(--bg-glass)',
              color: activeFilter === type ? '#fff' : 'var(--color-text-primary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {type === 'all' ? `All (${unreadAll})` : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        {unreadAll > 0 && (
          <button onClick={handleMarkAllRead} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-light)', background: 'var(--bg-glass)', color: 'var(--color-text-primary)', fontSize: 12, cursor: 'pointer' }}>
            Mark all read
          </button>
        )}
      </div>

      {filtered.map((n) => (
        <div
          key={n.id}
          onClick={() => { if (!n.read) handleMarkRead(n.id); }}
          className="feed-post-wrapper"
          style={{
            padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            opacity: n.read ? 0.6 : 1,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `linear-gradient(135deg, ${NOTIF_COLORS[n.type] || '#7B4DFF'}, var(--border-medium))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 13, fontWeight: 700, color: 'var(--color-text-white)',
          }}>
            {(n.fromUserName || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>{n.fromUserName}</strong>{' '}{n.message}
            </p>
            <span style={{ fontSize: 12, color: 'var(--color-text-placeholder)', marginTop: 2, display: 'block' }}>
              {formatTime(n.createdAt)}
            </span>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--bg-glass)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {iconMap[n.type]}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p style={{ color: 'var(--color-text-placeholder)', textAlign: 'center', padding: 40 }}>No notifications yet</p>
      )}
    </div>
  );
};

export default Notifications;
