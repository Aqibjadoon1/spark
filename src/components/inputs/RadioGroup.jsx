import { useId } from 'react';

/**
 * Radio group with fieldset/legend, custom radio circles, and row/col layout.
 *
 * @param {string} props.label - Group legend text
 * @param {Array<{value: string, label: string}>} props.options - Radio options
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.name - Radio group name
 * @param {'row'|'col'} props.direction - Layout direction
 * @param {string} props.error - Error message
 */
export default function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  name,
  direction = 'col',
  error,
}) {
  const id = useId();

  return (
    <fieldset className="border-0 p-0 m-0">
      {label && (
        <legend className="text-sm font-medium text-text-muted mb-2">
          {label}
        </legend>
      )}
      <div className={`flex gap-3 ${direction === 'col' ? 'flex-col' : 'flex-row flex-wrap'}`}>
        {options.map((opt) => {
          const optId = `${id}-${opt.value}`;
          const selected = value === opt.value;

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={`inline-flex items-center gap-3 cursor-pointer group ${direction === 'col' ? 'py-1' : ''}`}
            >
              <div className="relative flex items-center justify-center">
                <input
                  id={optId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  onChange={onChange}
                  className="peer sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0
                    ${
                      selected
                        ? 'border-lime'
                        : 'border-gray-300 dark:border-dark-border group-hover:border-lime/50'
                    }
                    peer-focus-visible:ring-2 peer-focus-visible:ring-lime/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-dark-bg`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      selected ? 'bg-lime scale-100' : 'scale-0'
                    }`}
                  />
                </div>
                <span className="text-sm text-[#09090B] dark:text-white">{opt.label}</span>
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-red mt-1" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
