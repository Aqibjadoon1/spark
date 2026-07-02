import { forwardRef, useId } from 'react';

/**
 * Custom styled select dropdown with arrow indicator, error state, and dark theme.
 *
 * @param {string} props.label - Label text
 * @param {Array<{value: string, label: string}>} props.options - Option list
 * @param {string} props.value - Controlled value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disables select
 * @param {boolean} props.required - Required indicator
 * @param {string} props.placeholder - Default placeholder option
 * @param {boolean} props.dark - Dark theme background
 * @param {string} props.className - Additional wrapper classes
 */
const SelectInput = forwardRef(function SelectInput(
  {
    label,
    options = [],
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder,
    dark = true,
    className = '',
    ...rest
  },
  ref,
) {
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
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-12 px-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red/50 focus:border-red focus:ring-red/20' : ''}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-gray"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default SelectInput;
