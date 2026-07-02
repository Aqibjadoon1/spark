import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import * as userService from '../services/userService';
import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  SET_USERS,
  CLEAR_USER,
} from '../redux/datatypes/userTypes';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null,
};

function usersReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'CLEAR_CURRENT_USER':
      return { ...state, currentUser: null };
    default:
      return state;
  }
}

const useUsers = () => {
  const [state, localDispatch] = useReducer(usersReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    localDispatch({ type: 'SET_LOADING', payload: true });

    const q = query(collection(db, COLLECTIONS.USERS));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        localDispatch({ type: 'SET_USERS', payload: usersList });
        reduxDispatch({ type: SET_USERS, payload: usersList });
      },
      (error) => {
        localDispatch({ type: 'SET_ERROR', payload: error.message });
        reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      }
    );

    return () => unsubscribe();
  }, [reduxDispatch]);

  const fetchUsers = useCallback(async () => {
    reduxDispatch({ type: FETCH_USERS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const users = await userService.getAllUsers();
      reduxDispatch({ type: FETCH_USERS_SUCCESS, payload: users });
      localDispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [reduxDispatch]);

  const fetchUserById = useCallback(async (uid) => {
    try {
      const user = await userService.getUserProfile(uid);
      localDispatch({ type: 'SET_CURRENT_USER', payload: user });
      reduxDispatch({ type: FETCH_USERS_SUCCESS, payload: user });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    }
  }, [reduxDispatch]);

  const updateProfile = useCallback(async (uid, data) => {
    reduxDispatch({ type: FETCH_USERS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await userService.updateUserProfile(uid, data);
      reduxDispatch({ type: UPDATE_PROFILE_SUCCESS, payload: user });
      localDispatch({ type: 'SET_CURRENT_USER', payload: user });
      return user;
    } catch (error) {
      reduxDispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const clearUser = useCallback(() => {
    localDispatch({ type: 'CLEAR_CURRENT_USER' });
    reduxDispatch({ type: CLEAR_USER });
  }, [reduxDispatch]);

  const sendFriendRequest = useCallback(async (toUid, fromUid) => {
    try {
      await userService.sendFriendRequest(fromUid, toUid);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const acceptFriendRequest = useCallback(async (fromUid, uid) => {
    try {
      await userService.acceptFriendRequest(uid, fromUid);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const rejectFriendRequest = useCallback(async (fromUid, uid) => {
    try {
      await userService.rejectFriendRequest(uid, fromUid);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const updateLocation = useCallback(async (lat, lng, city) => {
    try {
      const user = await userService.updateLocation(lat, lng, city);
      localDispatch({ type: 'SET_CURRENT_USER', payload: user });
      reduxDispatch({ type: UPDATE_PROFILE_SUCCESS, payload: user });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      reduxDispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  return {
    users: state.users,
    loading: state.loading,
    error: state.error,
    currentUser: state.currentUser,
    fetchUsers,
    fetchUserById,
    updateProfile,
    clearUser,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    updateLocation,
  };
};

export default useUsers;
