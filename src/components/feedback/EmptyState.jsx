const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="feed-empty">
      {icon && (
        <div className="feed-empty-icon">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="feed-empty-title">{title}</h3>
      )}
      {description && (
        <p className="feed-empty-desc">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
