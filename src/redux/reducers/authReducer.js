/**
 * Auth reducer.
 * @module redux/reducers/authReducer
 */

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

const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

/**
 * Auth reducer.
 * @param {Object} [state=initialState]
 * @param {Object} action
 * @returns {Object} Next state
 */
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_START:
    case REGISTER_START:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case LOGOUT:
      return { ...initialState, loading: false };

    case SET_AUTH_LOADING:
      return { ...state, loading: action.payload };

    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: !!action.payload,
      };

    case AUTH_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
