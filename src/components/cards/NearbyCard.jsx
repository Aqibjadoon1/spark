import { memo } from 'react';
import Avatar from '../globals/Avatar';

const NearbyCard = memo(({ user, distance, onSendRequest, onViewProfile }) => {
  if (!user) return null;

  return (
    <div className="bg-[#F3F3F3] dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[45px] p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.photoURL} name={user.displayName} size="md" online={user.online} />
          <div>
            <h3 className="text-base font-semibold text-[#191A23] dark:text-white">{user.displayName || 'Unknown User'}</h3>
            <p className="text-sm text-gray-500 dark:text-text-muted">{user.email}</p>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1 bg-lime/10 text-lime text-xs font-semibold rounded-full border border-lime/20">
          {distance}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSendRequest?.(user.uid)}
          className="flex-1 px-4 py-2 text-sm font-medium text-[#191A23] dark:text-white bg-white dark:bg-dark-bg rounded-xl hover:bg-black/10 dark:hover:bg-[#1E1E2A] transition-all border border-gray-200 dark:border-dark-border"
          aria-label={`Send friend request to ${user.displayName}`}
        >
          Add Friend
        </button>
        <button
          onClick={() => onViewProfile?.(user.uid)}
          className="flex-1 px-4 py-2 text-sm font-medium text-dark bg-lime rounded-xl hover:bg-lime-hover transition-all"
          aria-label={`View ${user.displayName}'s profile`}
        >
          View Profile
        </button>
      </div>
    </div>
  );
});

export default NearbyCard;
