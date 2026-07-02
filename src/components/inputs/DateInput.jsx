import { forwardRef, useId } from 'react';

/**
 * Date input with custom styling, dark theme, and validation props.
 *
 * @param {string} props.label - Label text
 * @param {string} props.value - Controlled date value (YYYY-MM-DD)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disables input
 * @param {boolean} props.required - Required indicator
 * @param {string} props.min - Minimum date (YYYY-MM-DD)
 * @param {string} props.max - Maximum date (YYYY-MM-DD)
 * @param {boolean} props.dark - Dark theme background
 * @param {string} props.className - Additional wrapper classes
 */
const DateInput = forwardRef(function DateInput(
  {
    label,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    min,
    max,
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
        <input
          ref={ref}
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-12 px-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark] ${error ? 'border-red/50 focus:border-red focus:ring-red/20' : ''}`}
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

export default DateInput;
