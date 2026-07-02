import { useState, useEffect, useRef, useCallback } from 'react';

const LoadingScreen = ({ children }) => {
  const [stage, setStage] = useState('entering');
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const hasShown = useRef(false);

  const animateProgress = useCallback(() => {
    startTimeRef.current = performance.now();
    const duration = 1800;

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(Math.round(eased * 100));
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setStage('exiting');
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    const enterTimer = setTimeout(() => setStage('visible'), 50);
    const loadingTimer = setTimeout(() => animateProgress(), 500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(loadingTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animateProgress]);

  useEffect(() => {
    if (stage !== 'visible') return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(interval);
  }, [stage]);

  const [removed, setRemoved] = useState(false);

  const handleExitEnd = useCallback(() => {
    setRemoved(true);
  }, []);

  useEffect(() => {
    if (stage !== 'exiting') return;
    const timer = setTimeout(handleExitEnd, 600);
    return () => clearTimeout(timer);
  }, [stage, handleExitEnd]);

  if (removed) return children;

  const dots = '.'.repeat(dotCount);
  const enteringStyle =
    stage === 'entering'
      ? 'opacity-0 scale-90'
      : stage === 'exiting'
        ? 'opacity-0 -translate-y-full scale-105'
        : 'opacity-100 scale-100 translate-y-0';

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D1117] transition-all duration-700 ease-in-out ${enteringStyle}`}
        aria-label="Loading application"
      >
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-lime/20 rounded-full blur-3xl animate-pulse" />
          <h1
            className="relative text-6xl sm:text-7xl font-bold text-lime tracking-tight select-none"
            style={{
              animation: 'floatGlow 3s ease-in-out infinite',
            }}
          >
            SPARK
          </h1>
        </div>

        <p className="text-gray-500 dark:text-text-muted text-sm mb-6 font-mono tracking-wider min-w-[60px] text-center">
          Loading{dots}
        </p>

        <div className="w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <style>{`
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 8px rgba(185,255,102,0.3)); }
          25% { transform: translateY(-4px) rotate(-0.5deg); filter: drop-shadow(0 0 16px rgba(185,255,102,0.5)); }
          50% { transform: translateY(-8px) rotate(0.5deg); filter: drop-shadow(0 0 24px rgba(185,255,102,0.6)); }
          75% { transform: translateY(-4px) rotate(-0.3deg); filter: drop-shadow(0 0 14px rgba(185,255,102,0.4)); }
        }
      `}</style>
      <div className={removed ? '' : 'hidden'}>{children}</div>
    </>
  );
};

export default LoadingScreen;
