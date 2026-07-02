const SearchBar = ({ value = '', onChange, onSearch, placeholder = 'Search...' }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative w-full">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all"
        aria-label="Search"
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#09090B] dark:text-text-gray dark:hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
