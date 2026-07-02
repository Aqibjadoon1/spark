import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseSDK';
import { showToast } from '../../redux/actions/uiActions';
import useAuth from '../../hooks/useAuth';

const icons = {
  feed: <svg viewBox="0 0 24 24" fill="none"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  explore: <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35M11 8a3 3 0 00-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  nearby: <svg viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></svg>,
  messages: <svg viewBox="0 0 24 24" fill="none"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  bookmarks: <svg viewBox="0 0 24 24" fill="none"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" strokeWidth="2"/></svg>,
  notifications: <svg viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

const navItems = [
  { path: '/feed', icon: 'feed', label: 'Feed' },
  { path: '/trending', icon: 'explore', label: 'Explore' },
  { path: '/nearby', icon: 'nearby', label: 'Nearby' },
  { path: '/messages', icon: 'messages', label: 'Messages' },
  { path: '/bookmarks', icon: 'bookmarks', label: 'Bookmarks' },
  { path: '/notifications', icon: 'notifications', label: 'Notifications' },
  { path: '/profile', icon: 'profile', label: 'Profile' },
  { path: '/dashboard', icon: 'analytics', label: 'Analytics' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/feed') return location.pathname === '/feed';
    if (path === '/profile') return location.pathname === '/profile' || location.pathname.startsWith('/profile/');
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch {
      dispatch(showToast('Logout failed', 'error'));
    }
  };

  return (
    <aside className="left-sidebar">
      <nav className="left-sidebar-nav">
        {navItems.map((item) => {
          const navPath = item.icon === 'profile' ? `/profile/${user?.uid}` : item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(navPath)}
              className={`sidebar-nav-item${isActive(item.path) ? ' active' : ''}`}
            >
              <span className="sidebar-nav-icon">{icons[item.icon]}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="left-sidebar-spacer" />

      <div className="left-sidebar-footer">
        <button onClick={handleLogout} className="sidebar-nav-item sidebar-logout">
          <span className="sidebar-nav-icon">{icons.logout}</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
