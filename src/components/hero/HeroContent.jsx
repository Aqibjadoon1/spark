import { useNavigate } from 'react-router-dom';

const HeroContent = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-left">
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        Now in Public Beta v2.0
      </div>

      <h1 className="hero-headline">
        Level Up Your&nbsp;
        <span className="hero-headline-gradient">Social Game</span>
      </h1>

      <p className="hero-subtitle">
        The social platform built for gamers, creators, and competitive communities.
        Track achievements, build your crew, and dominate the leaderboards.
      </p>

      <div className="hero-actions">
        <button
          className="hero-cta-primary"
          onClick={() => navigate('/register')}
        >
          Get Started Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <button
          className="hero-cta-secondary"
          onClick={() => navigate('/feed')}
        >
          Explore Feed
        </button>
      </div>

      <div className="hero-proof">
        <div className="hero-proof-avatars">
          <div className="hero-proof-avatar">JD</div>
          <div className="hero-proof-avatar" style={{ background: '#00C9B1' }}>AK</div>
          <div className="hero-proof-avatar" style={{ background: '#7B77D9' }}>ML</div>
          <div className="hero-proof-avatar" style={{ background: '#5A55CA' }}>TR</div>
        </div>
        <span className="hero-proof-text">
          <strong>24,000+</strong> gamers joined this week
        </span>
      </div>
    </div>
  );
};

export default HeroContent;
