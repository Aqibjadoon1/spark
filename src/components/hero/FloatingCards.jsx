const FloatingCards = () => (
  <div className="hero-floating-cards" aria-hidden="true">
    <div className="hero-card hero-card-main">
      <div className="hero-card-header">
        <div className="hero-card-avatar">NX</div>
        <div>
          <div className="hero-card-name">Elite Social</div>
          <div className="hero-card-username">@sparkgamer</div>
        </div>
      </div>
      <div className="hero-card-body">
        Just hit Grandmaster in ranked! The new season is insane.
      </div>
      <div className="hero-card-stats">
        <div className="hero-card-stat">
          <span className="hero-card-stat-value">2.4k</span>
          <span className="hero-card-stat-label">Likes</span>
        </div>
        <div className="hero-card-stat">
          <span className="hero-card-stat-value">847</span>
          <span className="hero-card-stat-label">Comments</span>
        </div>
      </div>
    </div>

    <div className="hero-card hero-card-top">
      <div className="hero-card-header">
        <div className="hero-card-avatar-sm" />
        <div>
          <div className="hero-card-name">Achievement</div>
        </div>
      </div>
      <div className="hero-card-body" style={{ marginBottom: 0 }}>
        <span className="hero-card-badge">Weekly Challenge</span>
      </div>
    </div>

    <div className="hero-card hero-card-bottom">
      <div className="hero-card-row">
        <div className="hero-card-dot" />
        <span className="hero-card-label">Online Now</span>
        <span className="hero-card-metric">12.4k</span>
      </div>
      <div className="hero-card-row">
        <div className="hero-card-dot" style={{ background: '#5A55CA' }} />
        <span className="hero-card-label">In Game</span>
        <span className="hero-card-metric">8.2k</span>
      </div>
    </div>

    <div className="hero-card hero-card-side">
      <div className="hero-card-header">
        <div className="hero-card-avatar-sm" />
        <div className="hero-card-name">LIVE</div>
      </div>
      <div className="hero-card-body" style={{ fontSize: 11, marginBottom: 0 }}>
        Stream started 2h ago
      </div>
    </div>

    <div className="hero-card hero-card-hidden">
      <div className="hero-card-header">
        <div className="hero-card-avatar-sm" style={{ background: '#00C9B1' }} />
        <div className="hero-card-name">New Friend</div>
      </div>
    </div>
  </div>
);

export default FloatingCards;
