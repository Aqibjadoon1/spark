import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../redux/actions/uiActions';
import { ROUTES } from '../../constants/routes';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { resetPassword, loading, error, clearError } = useAuth();

  const oobCode = searchParams.get('oobCode') || searchParams.get('code');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Reset Password | Elite Social';
  }, []);

  useEffect(() => {
    if (!oobCode) {
      dispatch(showToast('Invalid or missing reset code.', 'error'));
    }
  }, [oobCode, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showToast(error, 'error'));
      clearError();
    }
  }, [error, dispatch, clearError]);

  const validate = () => {
    const errs = {};
    if (!newPassword) errs.newPassword = 'Password is required';
    else if (newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !oobCode) return;
    try {
      await resetPassword(oobCode, newPassword);
      dispatch(showToast('Password reset successfully!', 'success'));
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  if (!oobCode) {
    return (
      <div className="forgot-card" style={{ textAlign: 'center' }}>
        <div className="forgot-sent-icon">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#FF3C9D" strokeWidth="2" strokeLinecap="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" />
          </svg>
        </div>
        <h2 className="forgot-heading">Invalid Reset Link</h2>
        <p className="forgot-text">This password reset link is invalid or has expired.</p>
        <button className="forgot-btn" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
          Request a new reset link
        </button>
      </div>
    );
  }

  return (
    <div className="forgot-card">
      <span className="forgot-label">RESET PASSWORD</span>
      <h2 className="forgot-heading">Choose a new password</h2>
      <p className="forgot-text">Enter your new password below.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="newPassword"
              type="password"
              className={`auth-input${errors.newPassword ? ' error' : ''}`}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '' })); }}
              autoComplete="new-password"
            />
          </div>
          {errors.newPassword && <span className="auth-field-error">{errors.newPassword}</span>}
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
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
