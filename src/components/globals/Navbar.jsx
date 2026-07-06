import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = memo(({ onToggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileOpen(false);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <button className="navbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <div className="navbar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <span className="navbar-logo-text">SPARK</span>
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <>
            <ThemeToggle />
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="navbar-avatar-btn"
              aria-label="User menu"
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="navbar-avatar" />
              ) : (
                <div className="navbar-avatar-placeholder">
                  {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="navbar-dropdown">
                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="navbar-dropdown-item">
                  Profile
                </button>
                <button onClick={() => { navigate('/settings'); setProfileOpen(false); }} className="navbar-dropdown-item">
                  Settings
                </button>
                <hr className="navbar-dropdown-divider" />
                <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-item--danger">
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="navbar-auth-btns">
            <button onClick={() => navigate('/login')} className="btn-nav-login">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="btn-nav-register">
              Join
            </button>
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;
