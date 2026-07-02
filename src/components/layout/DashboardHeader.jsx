import Avatar from '../globals/Avatar';

const DashboardHeader = ({ user, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-white/10" aria-label="Dashboard header">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-[#191A23] dark:text-text-muted dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 lg:hidden transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="text-sm text-gray-500 dark:text-text-muted">Welcome back,</p>
          <p className="text-base font-semibold text-[#191A23] dark:text-white">{user?.displayName || 'User'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-500 hover:text-[#191A23] dark:text-text-muted dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative" aria-label="Notifications">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5C7.5 2.5 5 4.5 5 8.5V11.5L3.5 14.5H16.5L15 11.5V8.5C15 4.5 12.5 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 14.5C8.5 16 9.5 16.5 10 16.5C10.5 16.5 11.5 16 12 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full" />
        </button>
        <button className="p-2 text-gray-500 hover:text-[#191A23] dark:text-text-muted dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2V3.5M10 16.5V18M3.5 10H2M18 10H16.5M5.05 5.05L4 4M16 16L14.95 14.95M5.05 14.95L4 16M16 4L14.95 5.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <Avatar src={user?.photoURL} name={user?.displayName} size="sm" online />
      </div>
    </header>
  );
};

export default DashboardHeader;
