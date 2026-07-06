import './Hero.css';
import MeshGradient from './MeshGradient';
import Particles from './Particles';
import GlowLayer from './GlowLayer';
import FloatingCards from './FloatingCards';
import HeroContent from './HeroContent';
import ThemeToggle from '../ui/ThemeToggle';
import logoSrc from '../../assets/new/web/icons8-logo-outline-hand-drawn-96.png';

const HeroSection = () => (
  <section className="hero-section">
    <MeshGradient />
    <GlowLayer />
    <div className="hero-noise" />
    <Particles />

    <header className="hero-header">
      <div className="hero-header-inner">
        <div className="hero-header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoSrc} alt="Elite Social" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }} />
          <span className="hero-header-brand">Elite Social</span>
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
