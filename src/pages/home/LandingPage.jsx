import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import HeroSection from '../../components/hero/HeroSection';

const features = [
  {
    title: 'Real-time Feed',
    description: 'Stay connected with a live stream of posts, updates, and conversations from your crew.',
    gradient: 'linear-gradient(135deg, #5A55CA, #7B77D9)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  },
  {
    title: 'Smart Trending',
    description: 'Discover what matters most. Our algorithm surfaces the hottest conversations first.',
    gradient: 'linear-gradient(135deg, #00C9B1, #00F0D0)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  },
  {
    title: 'Nearby Friends',
    description: 'Find and connect with people around you. Real-world connections made digital.',
    gradient: 'linear-gradient(135deg, #7B77D9, #5A55CA)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  },
  {
    title: 'Task Management',
    description: 'Organize your projects and to-dos with built-in task tracking and collaborative notes.',
    gradient: 'linear-gradient(135deg, #00C9B1, #5A55CA)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  },
];

const stats = [
  { value: '24K+', label: 'Active Gamers' },
  { value: '120K+', label: 'Posts Shared' },
  { value: '850+', label: 'Communities' },
  { value: '99.9%', label: 'Uptime' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Elite Social — Level Up Your Social Game';
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <HeroSection />

      <section className="lp-about">
        <div className="lp-about-inner">
          <span className="lp-section-tag">About</span>
          <h2 className="lp-section-title">What is Elite Social?</h2>
          <p className="lp-section-desc">
            Elite Social is the social platform built for gamers, creators, and competitive communities.
            Track achievements, share highlights, find your crew, and dominate the leaderboards.
            It&apos;s where your gaming identity meets social connection.
          </p>
        </div>
      </section>

      <section className="lp-features">
        <div className="lp-section-header">
          <span className="lp-section-tag">Features</span>
          <h2 className="lp-section-title">Built for Gamers</h2>
          <p className="lp-section-desc">Everything you need to level up your social experience</p>
        </div>
        <div className="lp-features-grid">
          {features.map((feature, index) => (
            <div key={feature.title} className="lp-feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div
                className="lp-feature-icon"
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <h3 className="lp-feature-title">{feature.title}</h3>
              <p className="lp-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="lp-stat-card">
              <p className="lp-stat-value">{stat.value}</p>
              <p className="lp-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-cta-card">
          <span className="lp-section-tag" style={{ color: '#B9FF66' }}>Join Now</span>
          <h2 className="lp-section-title" style={{ color: '#FFFFFF' }}>
            Ready to <span style={{ color: '#B9FF66' }}>Level Up</span>?
          </h2>
          <p className="lp-cta-text">
            Join 24,000+ gamers already building their crew on Elite Social.
          </p>
          <div className="lp-cta-actions">
            <button onClick={() => navigate(ROUTES.REGISTER)} className="lp-cta-btn">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button onClick={() => navigate(ROUTES.FEED)} className="lp-cta-btn-secondary">
              Browse Feed
            </button>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-footer-brand">Elite Social</span>
          <p className="lp-footer-copy">&copy; {new Date().getFullYear()} Elite Social. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
