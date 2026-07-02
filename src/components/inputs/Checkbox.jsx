import { useId } from 'react';

/**
 * Custom styled checkbox with checkmark, label, and error message.
 *
 * @param {string} props.label - Checkbox label text
 * @param {boolean} props.checked - Controlled checked state
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disables checkbox
 * @param {string} props.error - Error message
 * @param {string} props.name - Input name attribute
 */
export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  name,
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="inline-flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={!!error}
            className="peer sr-only"
          />
          <div
            className={`w-5 h-5 rounded-lg border-2 transition-all duration-200
              flex items-center justify-center shrink-0
              ${
                checked
                  ? 'bg-lime border-lime'
                  : 'bg-transparent border-gray-300 dark:border-dark-border group-hover:border-lime/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              peer-focus-visible:ring-2 peer-focus-visible:ring-lime/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-dark-bg`}
          >
            <svg
              className={`w-3 h-3 text-dark transition-all duration-200 ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {label && (
            <span className={`text-sm ${disabled ? 'text-text-muted' : 'text-[#09090B] dark:text-white'}`}>
              {label}
            </span>
          )}
        </div>
      </label>
      {error && (
        <p className="text-xs text-red mt-1 ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
