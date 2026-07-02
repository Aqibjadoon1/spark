/**
 * UI reducer.
 * @module redux/reducers/uiReducer
 */

import {
  SET_THEME,
  SHOW_TOAST,
  HIDE_TOAST,
  SET_MODAL,
  SET_SEARCH_QUERY,
  SET_SIDEBAR_OPEN,
} from '../datatypes/uiTypes';

const initialState = {
  theme: 'dark',
  toast: null,
  modal: {
    isOpen: false,
    type: null,
    props: null,
  },
  searchQuery: '',
  sidebarOpen: false,
};

/**
 * UI reducer.
 * @param {Object} [state=initialState]
 * @param {Object} action
 * @returns {Object} Next state
 */
export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };

    case SHOW_TOAST:
      return { ...state, toast: action.payload };

    case HIDE_TOAST:
      return { ...state, toast: null };

    case SET_MODAL:
      return {
        ...state,
        modal: {
          isOpen: action.payload.isOpen,
          type: action.payload.modalType,
          props: action.payload.modalProps,
        },
      };

    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };

    default:
      return state;
  }
};

export default uiReducer;
