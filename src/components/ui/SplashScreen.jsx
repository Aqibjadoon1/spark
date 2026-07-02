import { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    const removeTimer = setTimeout(() => onFinish?.(), 3600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-overlay${fadeOut ? ' fade-out' : ''}`}>
      <div className="splash-mark">
        <div className="splash-glow-ring splash-glow-ring-outer" />
        <div className="splash-glow-ring splash-glow-ring-inner" />

        <div className="splash-orbits">
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
        </div>

        <div className="splash-orbits-2">
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
          <div className="splash-orbit-dot" />
        </div>

        <div className="splash-mark-circle" />
        <div className="splash-mark-circle-inner" />

        <svg className="splash-mark-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-white)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <div className="splash-brand-row">
        <span className="splash-brand-letter">S</span>
        <span className="splash-brand-letter">P</span>
        <span className="splash-brand-letter">A</span>
        <span className="splash-brand-letter">R</span>
        <span className="splash-brand-letter">K</span>
      </div>

      <span className="splash-tagline">Level Up Your Social Game</span>

      <div className="splash-loading">
        <div className="splash-loading-bar" />
      </div>
    </div>
  );
};

export default SplashScreen;
