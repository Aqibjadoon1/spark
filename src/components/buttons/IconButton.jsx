/**
 * Circular icon-only button with ARIA label and hover state.
 *
 * @param {React.ReactNode} props.icon - SVG or icon element
 * @param {Function} props.onClick - Click handler
 * @param {string} props.label - Accessible ARIA label (required)
 * @param {'sm'|'md'|'lg'} props.size - Button size preset
 * @param {'primary'|'secondary'|'ghost'|'danger'} props.variant - Visual style
 * @param {string} props.className - Additional CSS classes
 */
import Button from './Button';

export default function IconButton({
  icon,
  onClick,
  label,
  size = 'md',
  variant = 'ghost',
  className = '',
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      aria-label={label}
      className={`rounded-full p-0 ${sizes[size]} ${className}`}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </Button>
  );
}
