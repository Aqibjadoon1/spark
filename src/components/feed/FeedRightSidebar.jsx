const trendingTags = ['#technology', '#gaming', '#design', '#music', '#ai', '#photography', '#fitness', '#travel'];
const categories = ['General', 'Technology', 'Lifestyle', 'Entertainment', 'Sports'];
const suggestedUsers = [
  { name: 'Alex Rivera', handle: '@alexrivera', avatar: 'AR' },
  { name: 'Sarah Chen', handle: '@sarahchen', avatar: 'SC' },
  { name: 'Marcus Johnson', handle: '@marcusj', avatar: 'MJ' },
];

const FeedRightSidebar = () => (
  <div className="right-sidebar-inner">
    <div className="rs-card">
      <div className="rs-card-header">
        <span className="rs-card-title">Trending Tags</span>
        <button className="rs-card-more">See all</button>
      </div>
      <div className="rs-tags">
        {trendingTags.map((tag) => (
          <span key={tag} className="rs-tag">#{tag.replace('#', '')}</span>
        ))}
      </div>
    </div>

    <div className="rs-card">
      <div className="rs-card-header">
        <span className="rs-card-title">Categories</span>
      </div>
      <div className="rs-categories">
        {categories.map((cat) => (
          <button key={cat} className="rs-category-btn">{cat}</button>
        ))}
      </div>
    </div>

    <div className="rs-card">
      <div className="rs-card-header">
        <span className="rs-card-title">Community Stats</span>
      </div>
      <div className="rs-stats">
        <div className="rs-stat">
          <span className="rs-stat-value">1,284</span>
          <span className="rs-stat-label">Posts</span>
        </div>
        <div className="rs-stat">
          <span className="rs-stat-value">342</span>
          <span className="rs-stat-label">Members</span>
        </div>
        <div className="rs-stat">
          <span className="rs-stat-value">23</span>
          <span className="rs-stat-label">Online</span>
        </div>
      </div>
    </div>

    <div className="rs-card">
      <div className="rs-card-header">
        <span className="rs-card-title">Who to Follow</span>
      </div>
      {suggestedUsers.map((user) => (
        <div key={user.handle} className="rs-user-row">
          <div className="rs-user-avatar">{user.avatar}</div>
          <div className="rs-user-info">
            <span className="rs-user-name">{user.name}</span>
            <span className="rs-user-handle">{user.handle}</span>
          </div>
          <button className="rs-follow-btn">Follow</button>
        </div>
      ))}
    </div>
  </div>
);

export default FeedRightSidebar;
