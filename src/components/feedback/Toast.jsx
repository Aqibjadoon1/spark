import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HIDE_TOAST } from '../../redux/datatypes/uiTypes';

const Toast = () => {
  const toast = useSelector((state) => state.ui?.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch({ type: HIDE_TOAST });
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const typeStyles = {
    success: 'text-lime',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
        <path d="M16.6666 5L7.49998 14.1667L3.33331 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 13.5H10.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 18H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 14H10.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 7V7.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  const style = typeStyles[toast.type] || typeStyles.info;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3" role="alert" aria-live="assertive">
      <div className="glass backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 min-w-[320px] max-w-[420px] shadow-2xl toast-anim">
        <div className="flex items-start gap-3">
          <div className={`${style}`}>
            {icons[toast.type] || icons.info}
          </div>
          <span className="text-sm text-white flex-1">{toast.message}</span>
          <button
            onClick={() => dispatch({ type: HIDE_TOAST })}
            className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-white transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
