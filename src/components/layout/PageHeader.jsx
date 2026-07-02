const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <svg className="w-3 h-3 text-gray-600" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {crumb.path ? (
                <a href={crumb.path} className="hover:text-gray-300 transition-colors">{crumb.label}</a>
              ) : (
                <span className="text-gray-300">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-text-muted text-base mt-2">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
