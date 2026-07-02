import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle, clearError } from '../../redux/actions/authActions';
import { showToast } from '../../redux/actions/uiActions';
import { ROUTES } from '../../constants/routes';
import { useCallback } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    document.title = 'Create Account | Spark';
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(showToast(error, 'error'));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    const errs = {};
    if (!displayName.trim()) errs.displayName = 'Display name is required';
    else if (displayName.trim().length < 2) errs.displayName = 'Name must be at least 2 characters';
    else if (displayName.trim().length > 50) errs.displayName = 'Name must be under 50 characters';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(registerUser(email, password, displayName.trim()));
      dispatch(showToast('Account created successfully!', 'success'));
      navigate(ROUTES.FEED, { replace: true });
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await dispatch(loginWithGoogle());
      dispatch(showToast('Signed in with Google!', 'success'));
      navigate(ROUTES.FEED, { replace: true });
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const goLogin = useCallback(() => navigate('/login'), [navigate]);

  return (
    <>
      <span className="auth-label">SIGN UP</span>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subtitle">Join our community and start connecting</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="displayName"
              type="text"
              className={`auth-input${errors.displayName ? ' error' : ''}`}
              placeholder="Full name"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: '' })); }}
              autoComplete="name"
            />
          </div>
          {errors.displayName && <span className="auth-field-error">{errors.displayName}</span>}
        </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              autoComplete="new-password"
            />
          </div>
          {errors.password && <span className="auth-field-error">{errors.password}</span>}
        </div>

        <div className="auth-field">
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="12" y1="15" x2="12" y2="17" />
            </svg>
            <input
              id="confirmPassword"
              type="password"
              className={`auth-input${errors.confirmPassword ? ' error' : ''}`}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
        </div>

        <div className="auth-check-row">
          <input
            type="checkbox"
            id="terms"
            className="auth-checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <label className="auth-check-label" htmlFor="terms">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
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
        {googleLoading ? 'Signing up...' : 'Sign up with Google'}
      </button>

      <div className="auth-footer">
        <span className="auth-footer-text">
          Already have an account?{' '}
          <button type="button" className="auth-footer-link" onClick={goLogin}>Sign in</button>
        </span>
      </div>
    </>
  );
};

export default Register;
