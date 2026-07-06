import { useState, useCallback } from 'react';

const getStorageKey = (userId) => `user_reactions_${userId}`;

const loadReactions = (userId) => {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

const saveReactions = (userId, data) => {
  if (!userId) return;
  try { localStorage.setItem(getStorageKey(userId), JSON.stringify(data)); } catch {}
};

const useUserReactions = (userId) => {
  const [userReactions, setUserReactions] = useState(() => loadReactions(userId));

  const hasReacted = useCallback((postId, emoji) => {
    return !!userReactions[postId]?.includes(emoji);
  }, [userReactions]);

  const addReaction = useCallback((postId, emoji) => {
    setUserReactions(prev => {
      const existing = prev[postId] || [];
      if (existing.includes(emoji)) return prev;
      const next = { ...prev, [postId]: [...existing, emoji] };
      saveReactions(userId, next);
      return next;
    });
  }, [userId]);

  const removeReaction = useCallback((postId, emoji) => {
    setUserReactions(prev => {
      const existing = prev[postId];
      if (!existing?.includes(emoji)) return prev;
      const next = { ...prev, [postId]: existing.filter(e => e !== emoji) };
      saveReactions(userId, next);
      return next;
    });
  }, [userId]);

  const toggleReaction = useCallback((postId, emoji) => {
    if (hasReacted(postId, emoji)) {
      removeReaction(postId, emoji);
      return false;
    }
    addReaction(postId, emoji);
    return true;
  }, [hasReacted, addReaction, removeReaction]);

  return { hasReacted, addReaction, removeReaction, toggleReaction };
};

export default useUserReactions;
