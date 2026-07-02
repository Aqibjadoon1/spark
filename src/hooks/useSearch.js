import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useDebounce from './useDebounce';

const useSearch = (searchTerm) => {
  const debouncedTerm = useDebounce(searchTerm, 300);
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(false);

  const posts = useSelector((state) => state.posts.posts, []);
  const users = useSelector((state) => state.users.users, []);

  useEffect(() => {
    if (!debouncedTerm || debouncedTerm.trim().length === 0) {
      setResults({ posts: [], users: [] });
      setLoading(false);
      return;
    }

    setLoading(true);

    const query = debouncedTerm.toLowerCase().trim();

    const matchingPosts = posts.filter(
      (post) =>
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.content && post.content.toLowerCase().includes(query)) ||
        (post.authorName && post.authorName.toLowerCase().includes(query))
    );

    const matchingUsers = users.filter(
      (user) =>
        (user.displayName && user.displayName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );

    setResults({ posts: matchingPosts, users: matchingUsers });
    setLoading(false);
  }, [debouncedTerm, posts, users]);

  return { results, loading };
};

export default useSearch;
