import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, loginWithGoogle, clearError } from '../../redux/actions/authActions';
import { showToast } from '../../redux/actions/uiActions';
import { ROUTES } from '../../constants/routes';
import { useCallback } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login | Spark';
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(showToast(error, 'error'));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(loginUser(email, password));
      dispatch(showToast('Welcome back!', 'success'));
      const from = location.state?.from?.pathname || ROUTES.FEED;
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await dispatch(loginWithGoogle());
      dispatch(showToast('Signed in with Google!', 'success'));
      const from = location.state?.from?.pathname || ROUTES.FEED;
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const goRegister = useCallback(() => navigate('/register'), [navigate]);
  const goForgot = useCallback(() => navigate(ROUTES.FORGOT_PASSWORD), [navigate]);

  return (
    <>
      <span className="auth-label">LOGIN</span>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subtitle">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="email"
              type="email"
              className={`auth-input${errors.email ? ' error' : ''}`}
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="auth-field-error">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              type="password"
              className={`auth-input${errors.password ? ' error' : ''}`}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              autoComplete="current-password"
            />
          </div>
          {errors.password && <span className="auth-field-error">{errors.password}</span>}
        </div>

        <div className="auth-forgot-row">
          <button type="button" className="auth-forgot-link" onClick={goForgot} style={{ background: 'linear-gradient(135deg, #7B4DFF, #FF3FA7)', color: '#FFF', border: 'none', borderRadius: 14, padding: '8px 18px', fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: 'pointer', boxShadow: '0 4px 15px var(--shadow-glow-pink)', transition: 'all 0.3s ease', display: 'inline-block' }}>Forgot password?</button>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-divider">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">or continue with</span>
        <span className="auth-divider-line" />
      </div>

      <button type="button" className="auth-google-btn" onClick={handleGoogleLogin} disabled={googleLoading}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {googleLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={goRegister} style={{ background: 'linear-gradient(135deg, #7B4DFF, #FF3FA7)', color: '#FFF', border: 'none', borderRadius: 14, padding: '10px 28px', fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: 'pointer', boxShadow: '0 4px 15px var(--shadow-glow-pink)', transition: 'all 0.3s ease', display: 'inline-block' }}>Sign up</button>
        <span className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <button type="button" className="auth-footer-link" onClick={goRegister}>Sign up</button>
        </span>
      </div>
    </>
  );
};

export default Login;
