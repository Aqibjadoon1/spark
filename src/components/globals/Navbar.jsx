import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';
import ThemeToggle from '../ui/ThemeToggle';
import logoSrc from '../../assets/new/web/icons8-logo-outline-hand-drawn-32.png';

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
        <img src={logoSrc} alt="Elite Social" className="navbar-logo-img" />
        <span className="navbar-logo-text">Elite Social</span>
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
                <button onClick={() => { navigate(`/profile/${currentUser.uid}`); setProfileOpen(false); }} className="navbar-dropdown-item">
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
