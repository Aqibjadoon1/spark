/**
 * Root reducer combining all slice reducers.
 * @module redux/reducers/rootReducer
 */

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import userReducer from './userReducer';
import uiReducer from './uiReducer';

/**
 * Root reducer.
 */
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  users: userReducer,
  ui: uiReducer,
});

export default rootReducer;
