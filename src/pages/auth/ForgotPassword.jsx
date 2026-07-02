import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, clearError } from '../../redux/actions/authActions';
import { showToast } from '../../redux/actions/uiActions';
import { ROUTES } from '../../constants/routes';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password | Spark';
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(showToast(error, 'error'));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    if (!email.trim()) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Invalid email format'); return false; }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(forgotPassword(email));
      setSent(true);
      dispatch(showToast('Password reset email sent!', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  if (sent) {
    return (
      <div className="forgot-card">
        <div className="forgot-sent-icon">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#A15CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </div>
        <h2 className="forgot-heading">Check your email</h2>
        <p className="forgot-text">
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </p>
        <button className="forgot-btn" onClick={() => navigate(ROUTES.LOGIN)}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="forgot-card">
      <span className="forgot-label">PASSWORD RESET</span>
      <h2 className="forgot-heading">Forgot password?</h2>
      <p className="forgot-text">
        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
      </p>
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
              className={`auth-input${emailError ? ' error' : ''}`}
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              autoComplete="email"
            />
          </div>
          {emailError && <span className="auth-field-error">{emailError}</span>}
        </div>
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <div className="forgot-back">
        <button type="button" className="forgot-back-link" onClick={() => navigate(ROUTES.LOGIN)}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
