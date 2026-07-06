const Skeleton = ({ variant = 'text', count = 1 }) => {
  const variants = {
    text: <div className="skeleton" style={{ height: 16, width: '100%' }} />,
    card: (
      <div className="skeleton" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton" style={{ height: 12, width: '35%' }} />
            <div className="skeleton" style={{ height: 10, width: '25%' }} />
          </div>
        </div>
        <div className="skeleton" style={{ height: 16, width: '75%' }} />
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '65%' }} />
      </div>
    ),
    avatar: <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />,
    post: (
      <div className="skeleton pc-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton" style={{ height: 12, width: '30%' }} />
            <div className="skeleton" style={{ height: 10, width: '20%' }} />
          </div>
        </div>
        <div className="skeleton" style={{ height: 20, width: '65%' }} />
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ height: 28, width: 70, borderRadius: 999 }} />
          <div className="skeleton" style={{ height: 28, width: 90, borderRadius: 999 }} />
        </div>
      </div>
    ),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{variants[variant] || variants.text}</div>
      ))}
    </div>
  );
};

export default Skeleton;
