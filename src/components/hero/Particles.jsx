const Particles = () => (
  <div className="hero-particles" aria-hidden="true">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="hero-particle" />
    ))}
  </div>
);

export default Particles;
