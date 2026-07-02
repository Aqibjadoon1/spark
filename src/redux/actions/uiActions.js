/**
 * UI action creators.
 * @module redux/actions/uiActions
 */

import {
  SET_THEME,
  SHOW_TOAST,
  HIDE_TOAST,
  SET_MODAL,
  SET_SEARCH_QUERY,
  SET_SIDEBAR_OPEN,
} from '../datatypes/uiTypes';

/**
 * Set the active theme.
 * @param {string} theme
 * @returns {Object} Action
 */
export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: theme,
});

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 * @param {number} [duration=3000]
 * @returns {Object} Action
 */
export const showToast = (message, type = 'info', duration = 3000) => ({
  type: SHOW_TOAST,
  payload: { message, type, duration },
});

/**
 * Hide the current toast notification.
 * @returns {Object} Action
 */
export const hideToast = () => ({
  type: HIDE_TOAST,
});

/**
 * Set the modal state.
 * @param {boolean} isOpen
 * @param {string|null} [modalType=null]
 * @param {Object|null} [modalProps=null]
 * @returns {Object} Action
 */
export const setModal = (isOpen, modalType = null, modalProps = null) => ({
  type: SET_MODAL,
  payload: { isOpen, modalType, modalProps },
});

/**
 * Set the search query string.
 * @param {string} query
 * @returns {Object} Action
 */
export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

/**
 * Set the sidebar open/closed state.
 * @param {boolean} isOpen
 * @returns {Object} Action
 */
export const setSidebarOpen = (isOpen) => ({
  type: SET_SIDEBAR_OPEN,
  payload: isOpen,
});
