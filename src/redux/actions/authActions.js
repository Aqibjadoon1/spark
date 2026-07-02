/**
 * Auth action creators.
 * @module redux/actions/authActions
 */

import * as authService from '../../services/authService';
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  SET_AUTH_LOADING,
  SET_USER,
  AUTH_ERROR,
} from '../datatypes/authTypes';

/**
 * Log in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Function} Thunk
 */
export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_START });
  try {
    const user = await authService.loginUser(email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Function} Thunk
 */
export const registerUser = (email, password, displayName) => async (dispatch) => {
  dispatch({ type: REGISTER_START });
  try {
    const user = await authService.registerUser(email, password, displayName);
    dispatch({ type: REGISTER_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Log out the current user.
 * @returns {Function} Thunk
 */
export const logoutUser = () => async (dispatch) => {
  try {
    await authService.logoutUser();
    dispatch({ type: LOGOUT });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.message });
  }
};

/**
 * Set the auth loading state.
 * @param {boolean} bool
 * @returns {Object} Action
 */
export const setAuthLoading = (bool) => (dispatch) => {
  dispatch({ type: SET_AUTH_LOADING, payload: bool });
};

/**
 * Set the current user.
 * @param {Object|null} user
 * @returns {Object} Action
 */
export const setUser = (user) => (dispatch) => {
  dispatch({ type: SET_USER, payload: user });
};

/**
 * Log in with Google.
 * @returns {Function} Thunk
 */
export const loginWithGoogle = () => async (dispatch) => {
  dispatch({ type: LOGIN_START });
  try {
    const user = await authService.loginWithGoogle();
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Clear the current user (logout).
 * @returns {Function} Thunk
 */
export const clearUser = () => (dispatch) => {
  dispatch({ type: SET_USER, payload: null });
};

/**
 * Clear the current auth error.
 * @returns {Object} Action
 */
export const clearError = () => (dispatch) => {
  dispatch({ type: AUTH_ERROR, payload: null });
};

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Function} Thunk
 */
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: SET_AUTH_LOADING, payload: true });
  try {
    await authService.forgotPassword(email);
    dispatch({ type: SET_AUTH_LOADING, payload: false });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.message });
    dispatch({ type: SET_AUTH_LOADING, payload: false });
    throw error;
  }
};

/**
 * Reset password with an oobCode.
 * @param {string} oobCode
 * @param {string} newPassword
 * @returns {Function} Thunk
 */
export const resetPassword = (oobCode, newPassword) => async (dispatch) => {
  dispatch({ type: SET_AUTH_LOADING, payload: true });
  try {
    await authService.resetPassword(oobCode, newPassword);
    dispatch({ type: SET_AUTH_LOADING, payload: false });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, payload: error.message });
    dispatch({ type: SET_AUTH_LOADING, payload: false });
    throw error;
  }
};
