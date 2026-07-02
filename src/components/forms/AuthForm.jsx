import { useState } from 'react';

/**
 * Auth form that renders fields from config, handles internal state, validation, and loading.
 * @param {Array<{name: string, label: string, type: 'text'|'email'|'password', placeholder?: string, required?: boolean}>} props.fields - Field configurations
 * @param {Function} props.onSubmit - Submit handler with form data object
 * @param {boolean} props.isLoading - Loading state for submit button
 * @param {string} props.error - Error message to display
 * @param {string} props.submitLabel - Submit button text
 * @param {React.ReactNode} props.footer - Slot for links (forgot password, register, etc.)
 */
const AuthForm = ({ fields = [], onSubmit, isLoading = false, error, submitLabel = 'Submit', footer }) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}),
  );

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card-container space-y-5" noValidate>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={`auth-${field.name}`} className="block text-sm font-medium text-text-muted mb-2">
            {field.label}{field.required && <span className="text-red ml-0.5">*</span>}
          </label>
          {field.type === 'password' ? (
            <input
              id={`auth-${field.name}`}
              type="password"
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
               className="w-full h-12 px-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all"
              aria-label={field.label}
            />
          ) : (
            <input
              id={`auth-${field.name}`}
              type={field.type || 'text'}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
               className="w-full h-12 px-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all"
              aria-label={field.label}
            />
          )}
        </div>
      ))}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-xl text-sm text-red" role="alert">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 13.5H10.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {submitLabel}
      </button>

      {footer && <div className="mt-4">{footer}</div>}
    </form>
  );
};

export default AuthForm;
