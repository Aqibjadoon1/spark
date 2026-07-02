/**
 * Post action creators.
 * @module redux/actions/postActions
 */

import * as postService from '../../services/postService';
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

/**
 * Fetch posts, optionally filtered by category.
 * @param {string} [category]
 * @returns {Function} Thunk
 */
export const fetchPosts = (category) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_START });
  try {
    const posts = await postService.fetchPosts(category);
    dispatch({ type: FETCH_POSTS_SUCCESS, payload: posts });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

/**
 * Create a new post.
 * @param {Object} postData
 * @returns {Function} Thunk
 */
export const createPost = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_START });
  try {
    const post = await postService.createPost(postData);
    dispatch({ type: CREATE_POST_SUCCESS, payload: post });
    return post;
  } catch (error) {
    dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Update an existing post.
 * @param {string} postId
 * @param {Object} updates
 * @returns {Function} Thunk
 */
export const updatePost = (postId, updates) => async (dispatch) => {
  dispatch({ type: UPDATE_POST_START });
  try {
    const post = await postService.updatePost(postId, updates);
    dispatch({ type: UPDATE_POST_SUCCESS, payload: post });
    return post;
  } catch (error) {
    dispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Delete a post.
 * @param {string} postId
 * @returns {Function} Thunk
 */
export const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_START });
  try {
    await postService.deletePost(postId);
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
  } catch (error) {
    dispatch({ type: DELETE_POST_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * React to a post with an emoji.
 * @param {string} postId
 * @param {string} emoji
 * @param {string} userId
 * @returns {Function} Thunk
 */
export const reactToPost = (postId, emoji, userId) => async (dispatch) => {
  try {
    const updatedPost = await postService.reactToPost(postId, emoji, userId);
    dispatch({ type: REACT_TO_POST, payload: updatedPost });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

/**
 * Remove a reaction from a post.
 * @param {string} postId
 * @param {string} emoji
 * @param {string} userId
 * @returns {Function} Thunk
 */
export const removeReaction = (postId, emoji, userId) => async (dispatch) => {
  try {
    const updatedPost = await postService.removeReaction(postId, emoji, userId);
    dispatch({ type: REACT_TO_POST, payload: updatedPost });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

/**
 * Add a comment to a post.
 * @param {string} postId
 * @param {Object} comment
 * @returns {Function} Thunk
 */
export const addComment = (postId, comment) => async (dispatch) => {
  try {
    const updatedPost = await postService.addComment(postId, comment);
    dispatch({ type: ADD_COMMENT, payload: updatedPost });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

/**
 * Set posts directly in state.
 * @param {Array} posts
 * @returns {Object} Action
 */
export const setPosts = (posts) => ({
  type: SET_POSTS,
  payload: posts,
});

/**
 * Clear all posts from state.
 * @returns {Object} Action
 */
export const clearPosts = () => ({
  type: CLEAR_POSTS,
});

/**
 * Increment the view count of a post.
 * @param {string} postId
 * @returns {Function} Thunk
 */
export const incrementViewCount = (postId) => async (dispatch) => {
  try {
    await postService.incrementViewCount(postId);
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
};
