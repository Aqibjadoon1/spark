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

    const q = query(collection(db, COLLECTIONS.POSTS), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        localDispatch({ type: 'SET_POSTS', payload: postsList });
        reduxDispatch({ type: SET_POSTS, payload: postsList });
      },
      (error) => {
        localDispatch({ type: 'SET_ERROR', payload: error.message });
        reduxDispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
      }
    );

    return () => unsubscribe();
  }, [reduxDispatch]);

  const fetchPosts = useCallback(async (category) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const posts = await postService.getPosts(category);
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
      const post = await postService.createPost(data);
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
      const post = await postService.updatePost(id, data);
      reduxDispatch({ type: UPDATE_POST_SUCCESS, payload: post });
      return post;
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

  const reactToPost = useCallback(async (id, emoji) => {
    try {
      const updatedPost = await postService.reactToPost(id, emoji);
      return updatedPost;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const removeReaction = useCallback(async (id, emoji) => {
    try {
      const updatedPost = await postService.removeReaction(id, emoji);
      return updatedPost;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const addComment = useCallback(async (id, comment) => {
    try {
      const updatedPost = await postService.addComment(id, comment);
      return updatedPost;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const getPostById = useCallback(async (id) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const post = await postService.getPostById(id);
      localDispatch({ type: 'SET_CURRENT_POST', payload: post });
      return post;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const incrementViews = useCallback(async (id) => {
    try {
      await postService.incrementViewCount(id);
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
