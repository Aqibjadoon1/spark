import { memo } from 'react';
import Avatar from '../globals/Avatar';

const UserCard = memo(({ user, onSendRequest, onMessage, isFriend = false, hasPendingRequest = false }) => {
  if (!user) return null;

  return (
    <div className="bg-[#F3F3F3] dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[45px] p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all duration-200">
      <div className="flex items-center gap-4">
        <Avatar src={user.photoURL} name={user.displayName} size="md" online={user.online} />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[#191A23] dark:text-white truncate">{user.displayName || 'Unknown User'}</h3>
          <p className="text-sm text-gray-500 dark:text-text-muted truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {isFriend ? (
          <button
            onClick={() => onMessage?.(user.uid)}
            className="flex-1 px-4 py-2 text-sm font-medium text-dark bg-lime rounded-xl hover:bg-lime-hover transition-all"
            aria-label={`Message ${user.displayName}`}
          >
            Message
          </button>
        ) : hasPendingRequest ? (
          <button
            disabled
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 dark:text-text-muted bg-white/5 rounded-xl cursor-not-allowed"
            aria-label="Friend request pending"
          >
            Pending
          </button>
        ) : (
          <button
            onClick={() => onSendRequest?.(user.uid)}
            className="flex-1 px-4 py-2 text-sm font-medium text-[#191A23] dark:text-white bg-white dark:bg-dark-bg hover:bg-black/10 dark:hover:bg-[#1E1E2A] rounded-xl transition-all border border-gray-200 dark:border-dark-border"
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
