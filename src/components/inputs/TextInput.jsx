import { forwardRef, useId } from 'react';

/**
 * Text input with label, error state, required indicator, and dark theme support.
 *
 * @param {string} props.label - Input label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message displayed below input
 * @param {string} props.type - Input type (default 'text')
 * @param {string} props.value - Controlled value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disables input
 * @param {boolean} props.required - Shows asterisk on label
 * @param {string} props.name - Input name attribute
 * @param {string} props.className - Additional wrapper classes
 * @param {boolean} props.dark - Dark themed input (bg-[#191A23])
 */
const TextInput = forwardRef(function TextInput(
  {
    label,
    placeholder,
    error,
    type = 'text',
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
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-muted mb-2"
        >
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-12 px-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red/50 focus:border-red focus:ring-red/20' : ''}`}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default TextInput;
