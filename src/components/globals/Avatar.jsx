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
    <div className={`avatar ${sizes[size]}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="avatar-placeholder"
          aria-label={name || 'Unknown user'}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className="avatar-online"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
