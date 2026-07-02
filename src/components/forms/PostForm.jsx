import { useState, useEffect, useRef } from 'react';
import Avatar from '../globals/Avatar';
import useAuth from '../../hooks/useAuth';

const PostForm = ({ onSubmit, initialData, isLoading = false }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setTags(initialData.tags || []);
      setCategory(initialData.category || '');
    }
  }, [initialData]);

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/,/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageClick = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="cp-card">
      <div className="cp-header">
        <div className="cp-header-top">
          <Avatar src={user?.photoURL} name={user?.displayName || user?.name} size="sm" />
          <div>
            <h2 className="cp-title">Create Post</h2>
            <p className="cp-subtitle">Share something with your community</p>
          </div>
        </div>
      </div>

      <form className="cp-form" noValidate>
        <div className="cp-field">
          <label className="cp-label" htmlFor="cp-title">Title</label>
          <input
            id="cp-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="cp-input"
            placeholder="Enter your post title"
            aria-label="Post title"
          />
          {errors.title && <p className="cp-error">{errors.title}</p>}
        </div>

        <div className="cp-field">
          <label className="cp-label" htmlFor="cp-content">Content</label>
          <textarea
            id="cp-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="cp-textarea"
            placeholder="Share your thoughts, ideas, or story..."
            aria-label="Post content"
          />
          {errors.content && <p className="cp-error">{errors.content}</p>}
        </div>

        <div className="cp-row">
          <div className="cp-field">
            <label className="cp-label" htmlFor="cp-tags">Tags</label>
            <div className="cp-tags-area">
              {tags.map((tag) => (
                <span key={tag} className="cp-tag">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="cp-tag-remove" aria-label={`Remove tag ${tag}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </span>
              ))}
              <input
                id="cp-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="cp-tag-input"
                placeholder="Type and press Enter"
                aria-label="Add tags"
              />
            </div>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="cp-category">Category</label>
            <div className="cp-select-wrap">
              <select
                id="cp-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="cp-select"
                aria-label="Select category"
              >
                <option value="">Select a category</option>
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="entertainment">Entertainment</option>
                <option value="sports">Sports</option>
              </select>
              <svg className="cp-select-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="cp-field">
          <label className="cp-label">Image (optional)</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          <div className="cp-upload" onClick={handleImageClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleImageClick(); }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ maxHeight: 200, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <>
                <div className="cp-upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="cp-upload-text">Drag & drop or click to upload</span>
                <span className="cp-upload-hint">PNG, JPG, GIF up to 10MB</span>
              </>
            )}
          </div>
        </div>

        <div className="cp-footer">
          <div />
          <button
            type="button"
            onClick={async () => {
              if (!validate() || isLoading) return;
              await onSubmit?.({ title: title.trim(), content: content.trim(), tags, category, image: imageFile });
              setTitle('');
              setContent('');
              setTags([]);
              setCategory('');
              setTagInput('');
              setImageFile(null);
              setImagePreview(null);
            }}
            disabled={isLoading}
            className="cp-btn-primary"
          >
            {isLoading && <span className="cp-btn-spinner" />}
            {initialData ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
