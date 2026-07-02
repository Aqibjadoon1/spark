/**
 * Post reducer.
 * @module redux/reducers/postReducer
 */

import {
  FETCH_POSTS_START,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  CREATE_POST_START,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  UPDATE_POST_START,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_START,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  REACT_TO_POST,
  ADD_COMMENT,
  SET_POSTS,
  CLEAR_POSTS,
} from '../datatypes/postTypes';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

/**
 * Post reducer.
 * @param {Object} [state=initialState]
 * @param {Object} action
 * @returns {Object} Next state
 */
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_START:
    case CREATE_POST_START:
    case UPDATE_POST_START:
    case DELETE_POST_START:
      return { ...state, loading: true, error: null };

    case FETCH_POSTS_SUCCESS:
      return { ...state, posts: action.payload, loading: false, error: null };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
        error: null,
      };

    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        loading: false,
        error: null,
      };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        loading: false,
        error: null,
      };

    case FETCH_POSTS_FAILURE:
    case CREATE_POST_FAILURE:
    case UPDATE_POST_FAILURE:
    case DELETE_POST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case REACT_TO_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case SET_POSTS:
      return { ...state, posts: action.payload };

    case CLEAR_POSTS:
      return { ...state, posts: [], currentPost: null };

    default:
      return state;
  }
};

export default postReducer;
