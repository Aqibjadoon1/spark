import { memo } from 'react';
import Avatar from '../globals/Avatar';

const NearbyCard = memo(({ user, distance, onSendRequest, onViewProfile }) => {
  if (!user) return null;

  return (
    <div className="card-neubrutal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.photoURL} name={user.displayName} size="md" online={user.online} />
          <div>
            <h3 className="text-base font-semibold">{user.displayName || 'Unknown User'}</h3>
            <p className="text-sm" style={{color:'var(--color-text-muted)'}}>{user.email}</p>
          </div>
        </div>
        <span className="card-nearby-distance">
          {distance}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSendRequest?.(user.uid)}
          className="card-user-btn card-user-btn-outline"
          aria-label={`Send friend request to ${user.displayName}`}
        >
          Add Friend
        </button>
        <button
          onClick={() => onViewProfile?.(user.uid)}
          className="card-user-btn card-user-btn-solid"
          aria-label={`View ${user.displayName}'s profile`}
        >
          View Profile
        </button>
      </div>
    </div>
  );
});

export default NearbyCard;
