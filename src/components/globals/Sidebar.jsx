import { memo } from 'react';

const Sidebar = memo(({ items = [], activePath = '', onNavigate }) => {
  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border p-6 flex flex-col gap-2" aria-label="Sidebar navigation">
      {items.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => onNavigate?.(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-lime/10 text-lime font-semibold'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="w-5 h-5 shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
});

export default Sidebar;
