import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HIDE_TOAST } from '../../redux/datatypes/uiTypes';

const Toast = () => {
  const toast = useSelector((state) => state.ui?.toast);
  const dispatch = useDispatch();

  const duration = toast?.duration || 4000;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch({ type: HIDE_TOAST });
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, dispatch, duration]);

  if (!toast) return null;

  const icons = {
    success: (
      <svg className="toast-icon" viewBox="0 0 20 20" fill="none">
        <path d="M16.6666 5L7.49998 14.1667L3.33331 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg className="toast-icon" viewBox="0 0 20 20" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 13.5H10.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg className="toast-icon" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 18H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 14H10.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg className="toast-icon" viewBox="0 0 20 20" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 7V7.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={`toast toast-${toast.type || 'info'}`} role="alert" aria-live="assertive">
      <div className="toast-icon-wrap">
        {icons[toast.type] || icons.info}
      </div>
      <span className="toast-msg">{toast.message}</span>
      <button onClick={() => dispatch({ type: HIDE_TOAST })} className="toast-close" aria-label="Dismiss notification">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
};

export default Toast;
