import { forwardRef, useId } from 'react';

const TextArea = forwardRef(function TextArea(
  {
    label,
    placeholder,
    value = '',
    onChange,
    error,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
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
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full min-h-[120px] px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-[#09090B] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/20 transition-all resize-y disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red/50 focus:border-red focus:ring-red/20' : ''}`}
        {...rest}
      />
      <div className="flex justify-between items-center mt-1.5">
        {error && (
          <p id={`${id}-error`} className="text-xs text-red" role="alert">
            {error}
          </p>
        )}
        {maxLength && (
          <p className={`text-xs ml-auto ${value.length > maxLength * 0.9 ? 'text-red' : 'text-gray-500 dark:text-text-muted'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

export default TextArea;
