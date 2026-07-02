import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useUsers from '../../hooks/useUsers';
import usePosts from '../../hooks/usePosts';
import useTasks from '../../hooks/useTasks';
import useNotes from '../../hooks/useNotes';
import Skeleton from '../../components/globals/Skeleton';
import { showToast } from '../../redux/actions/uiActions';
import { ROUTES } from '../../constants/routes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useUsers();
  const { posts, loading: postsLoading } = usePosts();
  const { tasks, loading: tasksLoading } = useTasks();
  const { notes, loading: notesLoading } = useNotes();

  const loading = usersLoading || postsLoading || tasksLoading || notesLoading;

  const totalUsers = users?.length || 0;
  const totalPosts = posts?.length || 0;
  const activeTasks = tasks?.filter((t) => t.status !== 'done').length || 0;
  const totalNotes = notes?.length || 0;

  const recentUsers = users?.slice(0, 5) || [];
  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your platform</p>
      </div>

      {loading ? (
        <div className="dashboard-stat-grid">
          <Skeleton variant="card" count={4} />
        </div>
      ) : (
        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Users</div>
            <div className="dash-stat-value">{totalUsers}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Posts</div>
            <div className="dash-stat-value">{totalPosts}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Active Tasks</div>
            <div className="dash-stat-value">{activeTasks}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Notes</div>
            <div className="dash-stat-value">{totalNotes}</div>
          </div>
        </div>
      )}

      <div className="dashboard-stat-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Recent Users</h2>
            <span className="panel-card-count">{recentUsers.length}</span>
          </div>
          {loading ? (
            <Skeleton variant="text" count={5} />
          ) : recentUsers.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#888' }}>No users yet.</p>
          ) : (
            <div>
              {recentUsers.map((user) => (
                <div key={user.uid} className="animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user.displayName || 'Unnamed'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</p>
                    </div>
                  </div>
                  <span className="badge badge-muted" style={{ fontSize: '0.75rem' }}>{user.role || 'user'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Recent Posts</h2>
            <span className="panel-card-count">{recentPosts.length}</span>
          </div>
          {loading ? (
            <Skeleton variant="text" count={5} />
          ) : recentPosts.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#888' }}>No posts yet.</p>
          ) : (
            <div>
              {recentPosts.map((post) => (
                <div key={post.id} className="animate-in" style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{post.title || post.content?.slice(0, 60) || 'Untitled'}</p>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.125rem' }}>
                    {post.authorName || 'Unknown'} &middot; {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 className="panel-card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="dashboard-stat-grid">
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.ADMIN_USERS)}>
            <p style={{ fontWeight: '600' }}>Manage Users</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>View, edit roles, and manage users</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.ADMIN_TASKS)}>
            <p style={{ fontWeight: '600' }}>Manage Tasks</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>Create and assign tasks</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.ADMIN_NOTES)}>
            <p style={{ fontWeight: '600' }}>Manage Notes</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>View all platform notes</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
