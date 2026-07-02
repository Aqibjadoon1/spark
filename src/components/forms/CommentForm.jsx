import { useState } from 'react';

const MAX_CHARS = 500;

const CommentForm = ({ onSubmit, isLoading = false }) => {
  const [content, setContent] = useState('');

  const remaining = MAX_CHARS - content.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;
    onSubmit?.({ content: content.trim() });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setContent(e.target.value);
          }}
          rows={3}
          className="w-full px-4 py-3 bg-white dark:bg-dark-bg text-[#191A23] dark:text-white rounded-xl border-gray-200 dark:border-white/10 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 placeholder-gray-400 text-sm transition-all resize-none"
          placeholder="Write a comment..."
          aria-label="Comment content"
        />
        <span className={`absolute bottom-3 right-3 text-xs ${remaining < 20 ? 'text-red' : 'text-gray-500 dark:text-text-muted'}`}>
          {remaining}
        </span>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="px-5 py-2 bg-lime text-dark font-semibold text-sm rounded-xl hover:bg-lime-hover transition-all shadow-[4px_4px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
