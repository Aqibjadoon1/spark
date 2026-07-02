import './Hero.css';
import MeshGradient from './MeshGradient';
import Particles from './Particles';
import GlowLayer from './GlowLayer';
import FloatingCards from './FloatingCards';
import HeroContent from './HeroContent';
import ThemeToggle from '../ui/ThemeToggle';

const HeroSection = () => (
  <section className="hero-section">
    <MeshGradient />
    <GlowLayer />
    <div className="hero-noise" />
    <Particles />

    <header className="hero-header">
      <div className="hero-header-inner">
        <div className="hero-header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#heroLogoGrad)" />
            <defs>
              <linearGradient id="heroLogoGrad" x1="2" y1="2" x2="22" y2="21.02" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A15CFF" />
                <stop offset="1" stopColor="#FF3C9D" />
              </linearGradient>
            </defs>
          </svg>
          <span className="hero-header-brand">SPARK</span>
        </div>
        <div className="hero-header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>

    <div className="hero-container">
      <HeroContent />
      <div className="hero-right">
        <FloatingCards />
      </div>
    </div>
  </section>
);

export default HeroSection;
