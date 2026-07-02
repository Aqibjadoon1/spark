import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/globals/Navbar';

const adminNavItems = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
  { path: '/admin/users', icon: 'users', label: 'Users' },
  { path: '/admin/tasks', icon: 'tasks', label: 'Tasks' },
  { path: '/admin/notes', icon: 'notes', label: 'Notes' },
];

const icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  users: <svg viewBox="0 0 24 24" fill="none"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" /></svg>,
  tasks: <svg viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  notes: <svg viewBox="0 0 24 24" fill="none"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2" /></svg>,
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="sidebar-section-label">MAIN</div>
          {adminNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-nav-item${isActive(item.path, item.end) ? ' active' : ''}`}
            >
              {icons[item.icon]}
              {item.label}
            </button>
          ))}
        </aside>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
