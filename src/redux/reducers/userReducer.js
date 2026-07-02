/**
 * User reducer.
 * @module redux/reducers/userReducer
 */

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

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null,
};

/**
 * User reducer.
 * @param {Object} [state=initialState]
 * @param {Object} action
 * @returns {Object} Next state
 */
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_START:
    case UPDATE_PROFILE_START:
      return { ...state, loading: true, error: null };

    case FETCH_USERS_SUCCESS:
      return { ...state, users: action.payload, loading: false, error: null };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.uid === action.payload.uid ? action.payload : user
        ),
        currentUser:
          state.currentUser && state.currentUser.uid === action.payload.uid
            ? action.payload
            : state.currentUser,
        loading: false,
        error: null,
      };

    case FETCH_USERS_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_USER_BY_ID:
      return { ...state, currentUser: action.payload };

    case CLEAR_USER:
      return { ...state, currentUser: null };

    case SET_USERS:
      return { ...state, users: action.payload };

    default:
      return state;
  }
};

export default userReducer;
