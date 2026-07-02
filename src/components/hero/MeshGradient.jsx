const MeshGradient = ({ children }) => (
  <div className="hero-mesh" aria-hidden="true">
    <div className="hero-mesh-blob" />
    <div className="hero-mesh-blob" />
    <div className="hero-mesh-blob" />
    <div className="hero-mesh-blob" />
    <div className="hero-mesh-blob" />
    {children}
  </div>
);

export default MeshGradient;
