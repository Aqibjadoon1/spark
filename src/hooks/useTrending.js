import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const TRENDING_REFRESH_MS = 5 * 60 * 1000;
const TOP_N = 20;

const calculateScore = (post) => {
  const reactions = (post.reactions ? Object.keys(post.reactions).length : 0) * 3;
  const views = (post.views || 0) * 1;
  const comments = (post.comments ? post.comments.length : 0) * 2;

  const createdAt = post.createdAt?.toMillis ? post.createdAt.toMillis() : Date.now();
  const hoursSincePosted = (Date.now() - createdAt) / (1000 * 60 * 60);
  const recencyBoost = Math.max(0, 100 - hoursSincePosted * 2);

  return reactions + views + comments + recencyBoost;
};

const useTrending = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const computeTrending = useCallback((posts) => {
    const scored = posts
      .map((post) => ({
        ...post,
        score: calculateScore(post),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_N);

    setTrendingPosts(scored);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, COLLECTIONS.POSTS), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        computeTrending(posts);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    intervalRef.current = setInterval(() => {
      setTrendingPosts((prev) =>
        prev.map((post) => ({
          ...post,
          score: calculateScore(post),
        }))
        .sort((a, b) => b.score - a.score)
      );
    }, TRENDING_REFRESH_MS);

    return () => {
      unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [computeTrending]);

  const refreshTrending = useCallback(() => {
    setLoading(true);
    setTrendingPosts([]);
  }, []);

  return { trendingPosts, loading, error, refreshTrending };
};

export default useTrending;
