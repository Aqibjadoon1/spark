import { useEffect } from 'react';

const dummyBookmarks = [
  { id: 1, author: 'Alex Rivera', handle: '@alexrivera', avatar: 'AR', title: 'Understanding React Server Components', excerpt: 'React Server Components represent a paradigm shift in how we think about rendering. They allow components to run exclusively on the server...', tags: ['react', 'server-components', 'frontend'], saved: '2 days ago', color: '#7B4DFF' },
  { id: 2, author: 'Sarah Chen', handle: '@sarahchen', avatar: 'SC', title: 'The Future of CSS Grid', excerpt: 'CSS Grid has evolved far beyond its initial release. With subgrid, masonry, and container queries, layout design has never been more powerful...', tags: ['css', 'grid', 'web-design'], saved: '5 days ago', color: '#FF3C9D' },
  { id: 3, author: 'Marcus Johnson', handle: '@marcusj', avatar: 'MJ', title: 'TypeScript 5.0: What\'s New', excerpt: 'TypeScript 5.0 brings decorators, const type parameters, and significant performance improvements. Here\'s everything you need to know...', tags: ['typescript', 'javascript'], saved: '1 week ago', color: '#4A6CFF' },
  { id: 4, author: 'Emily Watson', handle: '@emilyw', avatar: 'EW', title: 'Building Accessible Web Applications', excerpt: 'Accessibility is not an afterthought — it\'s a fundamental aspect of web development. Learn how to build inclusive apps that work for everyone...', tags: ['a11y', 'accessibility', 'html'], saved: '1 week ago', color: '#A15CFF' },
  { id: 5, author: 'David Kim', handle: '@davidkim', avatar: 'DK', title: 'Exploring WebGPU Performance', excerpt: 'WebGPU provides modern graphics and compute capabilities directly in the browser. Early benchmarks show dramatic performance improvements...', tags: ['webgpu', 'graphics', 'performance'], saved: '2 weeks ago', color: '#00C9B1' },
];

const gradientColors = ['#7B4DFF,#A15CFF', '#FF3C9D,#FF6B6B', '#4A6CFF,#7B4DFF', '#A15CFF,#FF3C9D', '#00C9B1,#4A6CFF'];

const Bookmarks = () => {
  useEffect(() => { document.title = 'Bookmarks | Spark'; }, []);

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Bookmarks</h1>
        <p className="feed-subtitle">Posts you've saved for later</p>
      </div>

      {dummyBookmarks.map((item, i) => (
        <div key={item.id} className="feed-post-wrapper" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 120, height: 90, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${gradientColors[i]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-placeholder)', fontSize: 32, fontWeight: 800, fontFamily: 'Rajdhani' }}>{item.avatar.charAt(1)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg, ${gradientColors[i]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--color-text-white)', flexShrink: 0 }}>{item.avatar}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.author}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-placeholder)' }}>·</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.saved}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.excerpt}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {item.tags.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'var(--color-primary-bg)', color: 'var(--color-primary-light)', border: '1px solid var(--border-strong)' }}>#{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
