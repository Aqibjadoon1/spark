import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../pages/auth/Login';
import RegisterForm from '../pages/auth/Register';
import '../pages/auth/AuthPage.css';

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPath = location.pathname === '/login';
  const [mode, setMode] = useState(isLoginPath ? 'login' : 'register');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) {
      setMode(isLoginPath ? 'login' : 'register');
    }
  }, [location.pathname, animating]);

  const toggle = useCallback(() => {
    const next = mode === 'login' ? 'register' : 'login';
    setAnimating(true);
    setMode(next);
    setTimeout(() => {
      navigate(`/${next}`, { replace: true });
      setAnimating(false);
    }, 500);
  }, [mode, navigate]);

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Animated gradient overlay */}
        <div className={`auth-overlay ${isLogin ? 'login-mode' : 'register-mode'}`}>
          <div className="auth-overlay-bg" />
          <div className="auth-overlay-glow" />
          <div className="auth-overlay-content">
            <h2 className="auth-overlay-title">
              {isLogin ? 'New here?' : 'Already a member?'}
            </h2>
            <p className="auth-overlay-text">
              {isLogin
                ? 'Create an account and start your journey with us.'
                : 'Sign in to pick up where you left off.'}
            </p>
            <button className="auth-overlay-btn" onClick={toggle}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Particles + forms container */}
        <div className="auth-overlay-particles">
          <div className="auth-particles-inner">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="auth-particle" />
            ))}
          </div>
          <div className="auth-forms-container">
            <div className="auth-form-pane enter" key={mode}>
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
            <div className="auth-form-pane exit" aria-hidden="true">
              {isLogin ? <RegisterForm /> : <LoginForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
