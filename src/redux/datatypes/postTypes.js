/**
 * Post action type constants.
 * @module redux/datatypes/postTypes
 */

/** Request to fetch posts. */
export const FETCH_POSTS_START = 'FETCH_POSTS_START';
/** Posts fetched successfully. */
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
/** Failed to fetch posts. */
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

/** Request to create a post. */
export const CREATE_POST_START = 'CREATE_POST_START';
/** Post created successfully. */
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
/** Failed to create a post. */
export const CREATE_POST_FAILURE = 'CREATE_POST_FAILURE';

/** Request to update a post. */
export const UPDATE_POST_START = 'UPDATE_POST_START';
/** Post updated successfully. */
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
/** Failed to update a post. */
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

/** Request to delete a post. */
export const DELETE_POST_START = 'DELETE_POST_START';
/** Post deleted successfully. */
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
/** Failed to delete a post. */
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

/** A reaction was added to a post. */
export const REACT_TO_POST = 'REACT_TO_POST';
/** A comment was added to a post. */
export const ADD_COMMENT = 'ADD_COMMENT';
/** Set posts in state. */
export const SET_POSTS = 'SET_POSTS';
/** Clear all posts from state. */
export const CLEAR_POSTS = 'CLEAR_POSTS';
