import { useEffect } from 'react';

const notifications = [
  { id: 1, type: 'like', user: 'Sarah Chen', action: 'liked your post', target: 'Understanding React Server Components', time: '2m ago', avatar: 'SC', color: '#FF3C9D' },
  { id: 2, type: 'follow', user: 'Marcus Johnson', action: 'started following you', target: '', time: '15m ago', avatar: 'MJ', color: '#7B4DFF' },
  { id: 3, type: 'comment', user: 'Emily Watson', action: 'commented on your post', target: 'The Future of CSS Grid', time: '1h ago', avatar: 'EW', color: '#A15CFF' },
  { id: 4, type: 'like', user: 'David Kim', action: 'liked your post', target: 'Building Accessible Web Applications', time: '2h ago', avatar: 'DK', color: '#4A6CFF' },
  { id: 5, type: 'mention', user: 'Alex Rivera', action: 'mentioned you in a comment', target: 'TypeScript 5.0: What\'s New', time: '3h ago', avatar: 'AR', color: '#00C9B1' },
  { id: 6, type: 'follow', user: 'Lena Park', action: 'started following you', target: '', time: '5h ago', avatar: 'LP', color: '#FF6B6B' },
  { id: 7, type: 'comment', user: 'James Wilson', action: 'replied to your comment', target: 'Exploring WebGPU Performance', time: '8h ago', avatar: 'JW', color: '#7B4DFF' },
  { id: 8, type: 'like', user: 'Olivia Brown', action: 'liked your post', target: 'Building Accessible Web Applications', time: '12h ago', avatar: 'OB', color: '#FF3C9D' },
  { id: 9, type: 'system', user: 'Spark', action: 'Welcome to the community! Complete your profile to get started.', target: '', time: '1d ago', avatar: 'SP', color: '#A15CFF' },
];

const iconMap = {
  like: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="#FF3C9D" stroke="#FF3C9D" strokeWidth="2"/></svg>,
  follow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="#7B4DFF" strokeWidth="2"/></svg>,
  comment: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#A15CFF" strokeWidth="2"/></svg>,
  mention: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke="#4A6CFF" strokeWidth="2"/></svg>,
  system: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#A15CFF" strokeWidth="2"/></svg>,
};

const Notifications = () => {
  useEffect(() => { document.title = 'Notifications | Spark'; }, []);

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Notifications</h1>
        <p className="feed-subtitle">Stay updated with your community</p>
      </div>

      {notifications.map((n, i) => (
        <div key={n.id} className="feed-post-wrapper" style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${n.color}, var(--border-medium))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text-white)' }}>{n.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>{n.user}</strong>{' '}{n.action}
              {n.target && <><br /><span style={{ color: 'var(--color-primary-light)', fontSize: 13 }}>"{n.target}"</span></>}
            </p>
            <span style={{ fontSize: 12, color: 'var(--color-text-placeholder)', marginTop: 2, display: 'block' }}>{n.time}</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {iconMap[n.type]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
