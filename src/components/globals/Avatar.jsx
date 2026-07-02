import { useMemo } from 'react';

const Avatar = ({ src, name = '', size = 'md', online = false }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-20 h-20' };

  const initials = useMemo(() => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [name]);

  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 ${sizes[size]}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full bg-lime/20 text-lime flex items-center justify-center font-semibold text-sm"
          aria-label={name || 'Unknown user'}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className="absolute bottom-0 right-0 w-3 h-3 bg-lime rounded-full ring-2 ring-dark-bg"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
