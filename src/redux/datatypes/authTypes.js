/**
 * Auth action type constants.
 * @module redux/datatypes/authTypes
 */

/** Request to log in. */
export const LOGIN_START = 'LOGIN_START';
/** Login completed successfully. */
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
/** Login failed. */
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

/** Request to register. */
export const REGISTER_START = 'REGISTER_START';
/** Registration completed successfully. */
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
/** Registration failed. */
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

/** User logged out. */
export const LOGOUT = 'LOGOUT';
/** Set auth loading state. */
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';
/** Set the current user. */
export const SET_USER = 'SET_USER';
/** Set an auth error. */
export const AUTH_ERROR = 'AUTH_ERROR';
