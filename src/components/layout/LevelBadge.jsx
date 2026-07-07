import { useState, useEffect } from 'react';

const LevelBadge = ({ level = 1, xp = 0, xpToNext = 100 }) => {
  const [levelingUp, setLevelingUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);
  const pct = Math.min((xp / xpToNext) * 100, 100);

  useEffect(() => {
    if (level > prevLevel) {
      setLevelingUp(true);
      const t = setTimeout(() => { setLevelingUp(false); }, 1200);
      setPrevLevel(level);
      return () => clearTimeout(t);
    }
  }, [level, prevLevel]);

  return (
    <div className={`level-hud${levelingUp ? ' leveling-up' : ''}`}>
      <div className={`level-badge${levelingUp ? ' leveling-up' : ''}`}>
        {level}
        <span className="tick"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></span>
      </div>
      <div className="level-xp-wrap">
        <span className="level-label">Level {level}</span>
        <div className="level-xp-track">
          <div className={`level-xp-fill${levelingUp ? ' filling' : ''}`} style={{ ['--xp-pct' ]: `${pct}%`, width: levelingUp ? undefined : `${pct}%` }} />
        </div>
        <span className="level-xp-text">{xp} / {xpToNext} XP</span>
      </div>
    </div>
  );
};

export default LevelBadge;