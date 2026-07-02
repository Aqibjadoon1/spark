const Skeleton = ({ variant = 'text', count = 1 }) => {
  const variants = {
    text: <div className="h-4 bg-white/10 rounded w-full skeleton" />,
    card: (
      <div className="card-container p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full skeleton" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-white/10 rounded w-1/3 skeleton" />
            <div className="h-3 bg-white/10 rounded w-1/4 skeleton" />
          </div>
        </div>
        <div className="h-4 bg-white/10 rounded w-3/4 skeleton" />
        <div className="h-4 bg-white/10 rounded w-full skeleton" />
        <div className="h-4 bg-white/10 rounded w-2/3 skeleton" />
      </div>
    ),
    avatar: <div className="w-12 h-12 bg-white/10 rounded-full shrink-0 skeleton" />,
    post: (
      <div className="card-container p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full skeleton" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-white/10 rounded w-1/4 skeleton" />
            <div className="h-3 bg-white/10 rounded w-1/5 skeleton" />
          </div>
        </div>
        <div className="h-5 bg-white/10 rounded w-2/3 skeleton" />
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-full skeleton" />
          <div className="h-3 bg-white/10 rounded w-5/6 skeleton" />
          <div className="h-3 bg-white/10 rounded w-3/4 skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-white/10 rounded-full w-16 skeleton" />
          <div className="h-6 bg-white/10 rounded-full w-20 skeleton" />
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{variants[variant] || variants.text}</div>
      ))}
    </div>
  );
};

export default Skeleton;
