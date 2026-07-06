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
    <form onSubmit={handleSubmit}>
      <div className="comment-form-field">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setContent(e.target.value);
          }}
          rows={3}
          className="comment-form-textarea"
          placeholder="Write a comment..."
          aria-label="Comment content"
        />
        <span className={`comment-form-remaining${remaining < 20 ? ' warn' : ''}`}>
          {remaining}
        </span>
      </div>
      <div className="comment-form-footer">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="comment-form-btn"
        >
          {isLoading && (
            <svg className="comment-form-spinner" viewBox="0 0 24 24" fill="none">
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