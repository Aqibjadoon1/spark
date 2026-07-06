import { useMemo } from 'react';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import Skeleton from '../../components/globals/Skeleton';

const DAYS = 7;
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const UserDashboard = () => {
  const { user } = useAuth();
  const { posts, loading } = usePosts();
  const uid = user?.uid;

  const myPosts = useMemo(() => (posts || []).filter((p) => p.authorId === uid || p.userId === uid), [posts, uid]);

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const buckets = Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (DAYS - 1 - i));
      return { date: d, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, count: 0 };
    });
    myPosts.forEach((p) => {
      const ts = p.createdAt?.toMillis ? p.createdAt.toMillis() : p.createdAt?.toDate?.()?.getTime();
      if (!ts) return;
      const d = new Date(ts);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [myPosts]);

  const maxCount = Math.max(1, ...chartData.map((b) => b.count));

  const categoryCounts = useMemo(() => {
    const map = {};
    myPosts.forEach((p) => {
      const cat = (p.category || 'uncategorized').toLowerCase();
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [myPosts]);

  const totalReactions = useMemo(() => {
    return myPosts.reduce((sum, p) => {
      const r = p.reactions || {};
      return sum + Object.values(r).reduce((a, b) => a + b, 0);
    }, 0);
  }, [myPosts]);

  const totalViews = useMemo(() => {
    return myPosts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  }, [myPosts]);

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Welcome back, {user?.displayName || 'User'}</h1>
        <p>Here's what's happening with your account</p>
      </div>

      {loading ? (
        <div className="dashboard-stat-grid">
          <Skeleton variant="card" count={3} />
        </div>
      ) : (
        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">My Posts</div>
            <div className="dash-stat-value">{myPosts.length}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Reactions</div>
            <div className="dash-stat-value">{totalReactions}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Views</div>
            <div className="dash-stat-value">{totalViews}</div>
          </div>
        </div>
      )}

      <div className="dashboard-charts">
        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Posts per Day (Last {DAYS} Days)</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 16 }}>
            {chartData.map((b) => (
              <div key={b.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{b.count}</span>
                <div
                  title={`${b.date.toLocaleDateString()}: ${b.count} posts`}
                  style={{
                    width: '100%', maxWidth: 48,
                    height: `${(b.count / maxCount) * 100}%`,
                    minHeight: b.count > 0 ? 4 : 0,
                    borderRadius: '6px 6px 0 0',
                    background: 'linear-gradient(180deg, #7B4DFF, #FF3C9D)',
                    transition: 'height 0.4s ease',
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--color-text-placeholder)', marginTop: 6 }}>{dayLabels[b.date.getDay()]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Posts by Category</h2>
          </div>
          {categoryCounts.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-placeholder)', textAlign: 'center', padding: 24 }}>No posts yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
              {categoryCounts.map(([cat, count]) => {
                const pct = (count / myPosts.length) * 100;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>{cat}</span>
                      <span style={{ color: 'var(--color-text-placeholder)' }}>{count}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-glass-3)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #7B4DFF, #FF3C9D)', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
