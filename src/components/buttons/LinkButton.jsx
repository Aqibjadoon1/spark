import { Link } from 'react-router-dom';

/**
 * Renders a React Router Link styled like a Button.
 *
 * @param {string} props.to - Route path
 * @param {React.ReactNode} props.children - Link content
 * @param {'primary'|'secondary'|'ghost'|'danger'} props.variant - Visual style
 * @param {'sm'|'md'|'lg'} props.size - Size preset
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Optional icon before children
 */
export default function LinkButton({
  to,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = null,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg active:scale-[0.97] no-underline';

  const variants = {
    primary: 'bg-lime text-dark shadow-[4px_4px_0px_var(--color-dark)] hover:shadow-[6px_6px_0px_var(--color-dark)] hover:bg-lime-hover',
    secondary: 'bg-white dark:bg-dark-bg text-[#191A23] dark:text-white border-2 border-gray-300 dark:border-white/20 shadow-[4px_4px_0px_var(--color-lime)] hover:border-white/40 hover:shadow-[6px_6px_0px_var(--color-lime)]',
    ghost: 'bg-transparent text-[#191A23] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 shadow-none',
    danger: 'bg-red text-[#191A23] dark:text-white shadow-[4px_4px_0px_var(--color-dark)] hover:bg-red-muted hover:shadow-[6px_6px_0px_var(--color-dark)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Link>
  );
}
