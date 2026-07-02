import { forwardRef } from 'react';

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    onClick,
    children,
    className = '',
    type = 'button',
    ...rest
  },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  const Spinner = () => (
    <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${loading ? 'opacity-60 pointer-events-none' : ''} ${className}`}
      {...rest}
    >
      {loading ? <Spinner /> : icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
});

export default Button;
