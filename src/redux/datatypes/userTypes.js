/**
 * User action type constants.
 * @module redux/datatypes/userTypes
 */

/** Request to fetch users. */
export const FETCH_USERS_START = 'FETCH_USERS_START';
/** Users fetched successfully. */
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
/** Failed to fetch users. */
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

/** Request to update a profile. */
export const UPDATE_PROFILE_START = 'UPDATE_PROFILE_START';
/** Profile updated successfully. */
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
/** Failed to update a profile. */
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

/** A user was fetched by ID. */
export const FETCH_USER_BY_ID = 'FETCH_USER_BY_ID';
/** Clear the current user from state. */
export const CLEAR_USER = 'CLEAR_USER';
/** Set users in state. */
export const SET_USERS = 'SET_USERS';
