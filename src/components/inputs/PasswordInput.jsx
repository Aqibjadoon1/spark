import { forwardRef, useState, useId } from 'react';

/**
 * Password input with show/hide toggle icon.
 *
 * @param {string} props.label - Input label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message
 * @param {string} props.value - Controlled value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disables input
 * @param {boolean} props.required - Required indicator
 * @param {string} props.name - Input name attribute
 * @param {string} props.className - Additional wrapper classes
 * @param {boolean} props.dark - Dark themed input
 */
const PasswordInput = forwardRef(function PasswordInput(
  {
    label,
    placeholder = '••••••••',
    error,
    value,
    onChange,
    disabled = false,
    required = false,
    name,
    className = '',
    dark = true,
    ...rest
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-2">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-12 px-4 pr-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red/50 focus:border-red focus:ring-red/20' : ''}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-text-gray hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-lime/20"
        >
          {visible ? (
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default PasswordInput;
