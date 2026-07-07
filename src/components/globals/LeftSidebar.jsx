import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseSDK';
import { showToast } from '../../redux/actions/uiActions';
import useAuth from '../../hooks/useAuth';

const SvgIcon = ({ d, children, viewBox = '0 0 24 24' }) => (
  <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const icons = {
  feed: <SvgIcon d="M3 4h18v16H3V4zm2 2v12h14V6H5zm2 2h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />,
  explore: <SvgIcon d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-9h-2v6h2v-6zm0-4h-2v2h2V7z" />,
  group: <SvgIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m22 0v-2a4 4 0 0 0-3-3.87m-4-9.75a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />,
  map: <SvgIcon><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></SvgIcon>,
  chat_bubble: <SvgIcon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></SvgIcon>,
  bookmark: <SvgIcon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  notifications: <SvgIcon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4 11a2 2 0 0 1-4 0" />,
  person_pin: <SvgIcon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />,
  monitoring: <SvgIcon d="M18 20V10m-6 10V4M6 20v-6" />,
  settings: <SvgIcon d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />,
  logout: <SvgIcon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9" />,
};

const navItems = [
  { path: '/feed', icon: 'feed', label: 'Feed' },
  { path: '/trending', icon: 'explore', label: 'Explore' },
  { path: '/friends', icon: 'group', label: 'Friends' },
  { path: '/nearby', icon: 'map', label: 'Nearby' },
  { path: '/messages', icon: 'chat_bubble', label: 'Messages' },
  { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
  { path: '/notifications', icon: 'notifications', label: 'Notifications' },
  { path: '/profile', icon: 'person_pin', label: 'Profile' },
  { path: '/dashboard', icon: 'monitoring', label: 'Analytics' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

const LeftSidebar = ({ mobileOpen, onClose }) => {
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

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
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
    <aside className={`left-sidebar${mobileOpen ? ' left-sidebar--open' : ''}`}>
      <div className="left-sidebar-inner">
        <div>
          <ul className="sidebar-nav-list">
            {navItems.map((item, index) => {
              const navPath = item.icon === 'person_pin' ? `/profile/${user?.uid}` : item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(navPath)}
                    className={`sidebar-nav-link${isActive(item.path) ? ' active' : ''}`}
                    style={{ '--i': index }}
                  >
                    <span className="sidebar-nav-icon">{icons[item.icon]}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sidebar-new-post-wrap">
            <button className="sidebar-new-post-btn" onClick={() => navigate('/feed', { state: { openForm: true } })}>+ New Post</button>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span className="sidebar-nav-icon">{icons.logout}</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
