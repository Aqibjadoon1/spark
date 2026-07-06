import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseAvailable } from '../firebase/firebaseSDK';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import {
  SET_USER,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  AUTH_ERROR,
  SET_AUTH_LOADING,
} from '../redux/datatypes/authTypes';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: !!action.payload,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

const useAuth = () => {
  const [state, localDispatch] = useReducer(authReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    if (!firebaseAvailable) {
      localDispatch({ type: 'LOGOUT' });
      reduxDispatch({ type: LOGOUT });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              friends: [],
              friendRequests: [],
              createdAt: new Date().toISOString(),
            });
          }
          const snap = await getDoc(userRef);
          const profile = { uid: firebaseUser.uid, email: firebaseUser.email, ...snap.data() };
          localDispatch({ type: 'SET_USER', payload: profile });
          reduxDispatch({ type: SET_USER, payload: profile });
        } catch (err) {
          localDispatch({ type: 'SET_USER', payload: firebaseUser });
          reduxDispatch({ type: SET_USER, payload: firebaseUser });
        }
      } else {
        localDispatch({ type: 'LOGOUT' });
        reduxDispatch({ type: LOGOUT });
      }
    });

    return () => unsubscribe();
  }, [reduxDispatch]);

  const login = useCallback(async (email, password) => {
    reduxDispatch({ type: LOGIN_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.loginUser(email, password);
      reduxDispatch({ type: LOGIN_SUCCESS, payload: user });
      localDispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (error) {
      reduxDispatch({ type: LOGIN_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const register = useCallback(async (email, password, name) => {
    reduxDispatch({ type: LOGIN_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.registerUser(email, password, name);
      reduxDispatch({ type: LOGIN_SUCCESS, payload: user });
      localDispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (error) {
      reduxDispatch({ type: LOGIN_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const loginWithGoogle = useCallback(async () => {
    reduxDispatch({ type: LOGIN_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.loginWithGoogle();
      reduxDispatch({ type: LOGIN_SUCCESS, payload: user });
      localDispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (error) {
      reduxDispatch({ type: LOGIN_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const logout = useCallback(async () => {
    try {
      await authService.logoutUser();
      localDispatch({ type: 'LOGOUT' });
      reduxDispatch({ type: LOGOUT });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: AUTH_ERROR, payload: error.message });
    }
  }, [reduxDispatch]);

  const forgotPassword = useCallback(async (email) => {
    reduxDispatch({ type: SET_AUTH_LOADING, payload: true });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.forgotPassword(email);
      reduxDispatch({ type: SET_AUTH_LOADING, payload: false });
      localDispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      reduxDispatch({ type: AUTH_ERROR, payload: error.message });
      reduxDispatch({ type: SET_AUTH_LOADING, payload: false });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const resetPassword = useCallback(async (oobCode, newPassword) => {
    reduxDispatch({ type: SET_AUTH_LOADING, payload: true });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.resetPassword(oobCode, newPassword);
      reduxDispatch({ type: SET_AUTH_LOADING, payload: false });
      localDispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      reduxDispatch({ type: AUTH_ERROR, payload: error.message });
      reduxDispatch({ type: SET_AUTH_LOADING, payload: false });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const clearError = useCallback(() => {
    localDispatch({ type: 'CLEAR_ERROR' });
    reduxDispatch({ type: AUTH_ERROR, payload: null });
  }, [reduxDispatch]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };
};

export default useAuth;
