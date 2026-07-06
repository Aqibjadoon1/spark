import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import * as postService from '../services/postService';
import {
  FETCH_POSTS_START,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  CREATE_POST_START,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  SET_POSTS,
  CLEAR_POSTS,
} from '../redux/datatypes/postTypes';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

function postsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: null };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const usePosts = () => {
  const [state, localDispatch] = useReducer(postsReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    localDispatch({ type: 'SET_LOADING', payload: true });

    let unsub1, unsub2;
    let realPosts = [];
    let dummyPosts = [];

    const mergeAndDispatch = () => {
      const merged = [...realPosts, ...dummyPosts].sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      localDispatch({ type: 'SET_POSTS', payload: merged });
      reduxDispatch({ type: SET_POSTS, payload: merged });
    };

    const q1 = query(collection(db, COLLECTIONS.POSTS), orderBy('createdAt', 'desc'));
    unsub1 = onSnapshot(q1, (snapshot) => {
      realPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      mergeAndDispatch();
    }, (error) => {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    });

    const q2 = query(collection(db, COLLECTIONS.DUMMY_POSTS), orderBy('createdAt', 'desc'));
    unsub2 = onSnapshot(q2, (snapshot) => {
      dummyPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      mergeAndDispatch();
    }, (error) => {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    });

    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, [reduxDispatch]);

  const fetchPosts = useCallback(async (category) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const real = await postService.getPosts(category, undefined, undefined, COLLECTIONS.POSTS);
      const dummy = await postService.getPosts(category, undefined, undefined, COLLECTIONS.DUMMY_POSTS);
      const posts = [...real, ...dummy].sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });
      reduxDispatch({ type: FETCH_POSTS_SUCCESS, payload: posts });
      localDispatch({ type: 'SET_POSTS', payload: posts });
    } catch (error) {
      reduxDispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [reduxDispatch]);

  const createPost = useCallback(async (data) => {
    reduxDispatch({ type: CREATE_POST_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const post = await postService.createPost(data, COLLECTIONS.POSTS);
      reduxDispatch({ type: CREATE_POST_SUCCESS, payload: post });
      return post;
    } catch (error) {
      reduxDispatch({ type: CREATE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const updatePost = useCallback(async (id, data) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await postService.updatePost(id, data);
      reduxDispatch({ type: UPDATE_POST_SUCCESS, payload: { id, ...data } });
    } catch (error) {
      reduxDispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const deletePost = useCallback(async (id) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await postService.deletePost(id);
      reduxDispatch({ type: DELETE_POST_SUCCESS, payload: id });
    } catch (error) {
      reduxDispatch({ type: DELETE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const reactToPost = useCallback(async (id, emoji, collectionName) => {
    try {
      await postService.reactToPost(id, emoji, undefined, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const removeReaction = useCallback(async (id, emoji, collectionName) => {
    try {
      await postService.removeReaction(id, emoji, undefined, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const addComment = useCallback(async (id, comment, collectionName) => {
    try {
      await postService.addComment(id, comment, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const getPostById = useCallback(async (id, collectionName) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const post = await postService.getPostById(id, collectionName);
      localDispatch({ type: 'SET_CURRENT_POST', payload: post });
      return post;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const incrementViews = useCallback(async (id, collectionName) => {
    try {
      await postService.incrementViewCount(id, collectionName);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }, []);

  const clearPosts = useCallback(() => {
    localDispatch({ type: 'SET_POSTS', payload: [] });
    reduxDispatch({ type: CLEAR_POSTS });
  }, [reduxDispatch]);

  return {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    currentPost: state.currentPost,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    reactToPost,
    removeReaction,
    addComment,
    getPostById,
    incrementViews,
    clearPosts,
  };
};

export default usePosts;
