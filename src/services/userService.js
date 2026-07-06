/**
 * Firestore service for users.
 * @module services/userService
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';

const usersRef = collection(db, 'users');

/**
 * Create a new user profile document.
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const createUserProfile = async (uid, data) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await setDoc(userDoc, {
      ...data,
      friends: [],
      friendRequests: [],
      bookmarks: [],
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
};

/**
 * Get a user's profile by UID.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const snapshot = await getDoc(userDoc);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

/**
 * Update a user's profile.
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, data) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, data);
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

/**
 * Fetch all users.
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Subscribe to real-time user collection updates.
 * @param {(users: Array) => void} callback
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export const subscribeToUsers = (callback) => {
  try {
    return onSnapshot(
      usersRef,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(users);
      },
      (error) => {
        throw new Error(`Users subscription error: ${error.message}`);
      },
    );
  } catch (error) {
    throw new Error(`Failed to subscribe to users: ${error.message}`);
  }
};

/**
 * Send a friend request from one user to another.
 * @param {string} fromUid
 * @param {string} toUid
 * @returns {Promise<void>}
 */
export const sendFriendRequest = async (fromUid, toUid) => {
  try {
    const toDoc = doc(db, 'users', toUid);
    await updateDoc(toDoc, {
      friendRequests: arrayUnion(fromUid),
    });
  } catch (error) {
    throw new Error(`Failed to send friend request: ${error.message}`);
  }
};

/**
 * Accept a friend request from another user.
 * @param {string} uid - The current user ID
 * @param {string} fromUid - The requester's ID
 * @returns {Promise<void>}
 */
export const acceptFriendRequest = async (uid, fromUid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const fromDoc = doc(db, 'users', fromUid);

    await updateDoc(userDoc, {
      friendRequests: arrayRemove(fromUid),
      friends: arrayUnion(fromUid),
    });

    await updateDoc(fromDoc, {
      friends: arrayUnion(uid),
    });
  } catch (error) {
    throw new Error(`Failed to accept friend request: ${error.message}`);
  }
};

/**
 * Reject a friend request from another user.
 * @param {string} uid - The current user ID
 * @param {string} fromUid - The requester's ID
 * @returns {Promise<void>}
 */
export const rejectFriendRequest = async (uid, fromUid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, {
      friendRequests: arrayRemove(fromUid),
    });
  } catch (error) {
    throw new Error(`Failed to reject friend request: ${error.message}`);
  }
};

/**
 * Update a user's location.
 * @param {string} uid
 * @param {number} lat
 * @param {number} lng
 * @param {string} city
 * @returns {Promise<void>}
 */
export const updateLocation = async (uid, lat, lng, city) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, {
      location: { lat, lng, city },
    });
  } catch (error) {
    throw new Error(`Failed to update location: ${error.message}`);
  }
};

/**
 * Get nearby users using an approximate bounding box query.
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} radius - Radius in kilometers
 * @returns {Promise<Array>}
 */
export const getNearbyUsers = async (lat, lng, radius) => {
  try {
    const latDelta = radius / 111.32;
    const lngDelta = radius / (111.32 * Math.cos(lat * (Math.PI / 180)));

    const q = query(
      usersRef,
      where('location.lat', '>=', lat - latDelta),
      where('location.lat', '<=', lat + latDelta),
      where('location.lng', '>=', lng - lngDelta),
      where('location.lng', '<=', lng + lngDelta),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch nearby users: ${error.message}`);
  }
};
