const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <span className="w-8 h-8 text-text-muted">{icon}</span>
        </div>
      )}
      {title && (
        <h3 className="text-xl font-semibold text-[#191A23] dark:text-white mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-text-muted max-w-md mb-6">{description}</p>
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
