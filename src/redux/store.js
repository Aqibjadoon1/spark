/**
 * Redux store configuration.
 * @module redux/store
 */

import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

/**
 * The Redux store instance.
 */
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
