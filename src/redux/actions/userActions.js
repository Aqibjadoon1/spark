/**
 * User action creators.
 * @module redux/actions/userActions
 */

import * as userService from '../../services/userService';
import * as storageService from '../../services/storageService';
import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  UPDATE_PROFILE_START,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  FETCH_USER_BY_ID,
  CLEAR_USER,
  SET_USERS,
} from '../datatypes/userTypes';

/**
 * Fetch all users.
 * @returns {Function} Thunk
 */
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_START });
  try {
    const users = await userService.fetchUsers();
    dispatch({ type: FETCH_USERS_SUCCESS, payload: users });
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};

/**
 * Update a user's profile, optionally uploading a new photo.
 * @param {string} uid
 * @param {Object} data
 * @returns {Function} Thunk
 */
export const updateProfile = (uid, data) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_START });
  try {
    let profileData = { ...data };

    if (data.photoFile) {
      const photoURL = await storageService.uploadProfilePhoto(uid, data.photoFile);
      profileData.photoURL = photoURL;
      delete profileData.photoFile;
    }

    const user = await userService.updateProfile(uid, profileData);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Fetch a single user by their UID.
 * @param {string} uid
 * @returns {Function} Thunk
 */
export const fetchUserById = (uid) => async (dispatch) => {
  try {
    const user = await userService.fetchUserById(uid);
    dispatch({ type: FETCH_USER_BY_ID, payload: user });
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};

/**
 * Clear the current user from state.
 * @returns {Object} Action
 */
export const clearUser = () => ({
  type: CLEAR_USER,
});

/**
 * Send a friend request.
 * @param {string} fromUid
 * @param {string} toUid
 * @returns {Function} Thunk
 */
export const sendFriendRequest = (fromUid, toUid) => async (dispatch) => {
  try {
    await userService.sendFriendRequest(fromUid, toUid);
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Accept a friend request.
 * @param {string} uid
 * @param {string} fromUid
 * @returns {Function} Thunk
 */
export const acceptFriendRequest = (uid, fromUid) => async (dispatch) => {
  try {
    await userService.acceptFriendRequest(uid, fromUid);
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Reject a friend request.
 * @param {string} uid
 * @param {string} fromUid
 * @returns {Function} Thunk
 */
export const rejectFriendRequest = (uid, fromUid) => async (dispatch) => {
  try {
    await userService.rejectFriendRequest(uid, fromUid);
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    throw error;
  }
};

/**
 * Update a user's location.
 * @param {string} uid
 * @param {number} lat
 * @param {number} lng
 * @param {string} city
 * @returns {Function} Thunk
 */
export const updateLocation = (uid, lat, lng, city) => async (dispatch) => {
  try {
    const user = await userService.updateLocation(uid, lat, lng, city);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
    throw error;
  }
};
