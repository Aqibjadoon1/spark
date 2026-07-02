import { useContext, useCallback, useMemo } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  const handleClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    },
    [toggleTheme],
  );

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '48px',
        height: '26px',
        borderRadius: '999px',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        flexShrink: 0,
        transition: 'background-color 250ms, box-shadow 250ms',
        background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        boxShadow: isDark ? 'inset 0 0 8px rgba(161,92,255,0.1)' : 'inset 0 0 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: isDark ? '3px' : '23px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: isDark ? '#1A1A2E' : '#FFFFFF',
          boxShadow: isDark
            ? '0 0 6px rgba(161,92,255,0.15)'
            : '0 2px 6px rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 250ms, background 250ms, box-shadow 250ms',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 250ms, transform 250ms',
          }}
        >
          {isDark ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#A15CFF">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#7B4DFF">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          )}
        </span>
      </div>

      {isDark && (
        <>
          <span
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(161,92,255,0.3)',
              top: '6px',
              right: '7px',
              filter: 'blur(0.5px)',
              transition: 'opacity 250ms',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: 'rgba(161,92,255,0.2)',
              top: '16px',
              right: '5px',
              filter: 'blur(0.5px)',
              transition: 'opacity 250ms',
            }}
          />
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
