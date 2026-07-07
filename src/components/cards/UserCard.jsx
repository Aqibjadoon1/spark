import { memo } from 'react';
import Avatar from '../globals/Avatar';

const UserCard = memo(({ user, onSendRequest, onMessage, isFriend = false, hasPendingRequest = false }) => {
  if (!user) return null;

  return (
    <div className="card-neubrutal">
      <div className="flex items-center gap-4">
        <Avatar src={user.photoURL} name={user.displayName} size="md" online={user.online} />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">{user.displayName || 'Unknown User'}</h3>
          <p className="text-sm truncate" style={{color:'var(--color-text-muted)'}}>{user.email}</p>
        </div>
      </div>
      <div className="card-user-actions">
        {isFriend ? (
          <button
            onClick={() => onMessage?.(user.uid)}
            className="card-user-btn card-user-btn-solid"
            aria-label={`Message ${user.displayName}`}
          >
            Message
          </button>
        ) : hasPendingRequest ? (
          <button
            disabled
            className="card-user-btn card-user-btn-disabled"
            aria-label="Friend request pending"
          >
            Pending
          </button>
        ) : (
          <button
            onClick={() => onSendRequest?.(user.uid)}
            className="card-user-btn card-user-btn-outline"
            aria-label={`Send friend request to ${user.displayName}`}
          >
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
});

export default UserCard;
