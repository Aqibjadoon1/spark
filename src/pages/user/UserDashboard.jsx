import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import useTasks from '../../hooks/useTasks';
import useNotes from '../../hooks/useNotes';
import Skeleton from '../../components/globals/Skeleton';
import { ROUTES } from '../../constants/routes';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading: postsLoading } = usePosts();
  const { tasks, loading: tasksLoading } = useTasks();
  const { notes, loading: notesLoading } = useNotes();

  const loading = postsLoading || tasksLoading || notesLoading;
  const uid = user?.uid;

  const myPosts = posts?.filter((p) => p.authorId === uid || p.userId === uid) || [];
  const myTasks = tasks?.filter((t) => t.assignedTo === uid) || [];
  const myNotes = notes?.filter((n) => n.userId === uid || n.authorId === uid) || [];
  const myActiveTasks = myTasks.filter((t) => t.status !== 'done');

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Welcome back, {user?.displayName || 'User'}</h1>
        <p>Here's what's happening with your account</p>
      </div>

      {loading ? (
        <div className="dashboard-stat-grid">
          <Skeleton variant="card" count={4} />
        </div>
      ) : (
        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">My Posts</div>
            <div className="dash-stat-value">{myPosts.length}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Active Tasks</div>
            <div className="dash-stat-value">{myActiveTasks.length}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">My Notes</div>
            <div className="dash-stat-value">{myNotes.length}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dash-stat-label">Total Tasks</div>
            <div className="dash-stat-value">{myTasks.length}</div>
          </div>
        </div>
      )}

      <div className="dashboard-stat-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">My Recent Tasks</h2>
            <button className="btn-see-all" onClick={() => navigate(ROUTES.USER_TASKS)}>See All</button>
          </div>
          {loading ? (
            <Skeleton variant="text" count={4} />
          ) : myTasks.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#888' }}>No tasks assigned to you yet.</p>
          ) : (
            <div>
              {myTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{task.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.125rem' }}>
                      Due: {task.dueDate
                        ? new Date(task.dueDate.seconds ? task.dueDate.seconds * 1000 : task.dueDate).toLocaleDateString()
                        : 'No due date'}
                    </p>
                  </div>
                  <span className={`badge ${task.status === 'done' ? 'badge-done' : task.status === 'in-progress' ? 'badge-progress' : 'badge-todo'}`}>{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">My Recent Notes</h2>
            <button className="btn-see-all" onClick={() => navigate(ROUTES.USER_NOTES)}>See All</button>
          </div>
          {loading ? (
            <Skeleton variant="text" count={4} />
          ) : myNotes.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#888' }}>No notes yet.</p>
          ) : (
            <div>
              {myNotes.slice(0, 5).map((note) => (
                <div key={note.id} className="animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {note.pinned && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>&#9733;</span>}
                    <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{note.title || 'Untitled'}</p>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#888' }}>{note.content || 'No content'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 className="panel-card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="dashboard-stat-grid">
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.USER_TASKS)}>
            <p style={{ fontWeight: '600' }}>My Tasks</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>View and manage your tasks</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.USER_NOTES)}>
            <p style={{ fontWeight: '600' }}>My Notes</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>View and manage your notes</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
          <div className="panel-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile/' + user?.uid)}>
            <p style={{ fontWeight: '600' }}>My Profile</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>View your public profile</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Go</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
