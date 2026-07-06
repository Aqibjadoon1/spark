/**
 * Firebase Authentication service.
 * @module services/authService
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseSDK';
import { createUserProfile } from './userService';

/**
 * Log in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const loginUser = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Register a new user with email, password, and display name.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').User>}
 */
export const registerUser = async (email, password, displayName) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await credential.user.updateProfile({ displayName });
    await createUserProfile(credential.user.uid, {
      email,
      displayName,
      name: displayName,
      photoURL: credential.user.photoURL || '',
      role: 'user',
    });
    return credential.user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Log in with Google popup.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) {
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        name: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL || '',
        role: 'user',
      });
    }
    return result;
  } catch (error) {
    throw new Error(`Google login failed: ${error.message}`);
  }
};

/**
 * Log out the current user.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Get the currently authenticated user.
 * @returns {import('firebase/auth').User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes.
 * @param {(user: import('firebase/auth').User|null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe} Unsubscribe function
 */
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send email verification to the current user.
 * @param {import('firebase/auth').User} user
 * @returns {Promise<void>}
 */
export const sendEmailVerification = async (user) => {
  try {
    await firebaseSendEmailVerification(user);
  } catch (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(`Password reset email failed: ${error.message}`);
  }
};

/**
 * Reset password using an oobCode.
 * @param {string} oobCode
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (oobCode, newPassword) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

/**
 * Set auth persistence level.
 * @param {boolean} rememberMe - true for local persistence, false for session
 * @returns {Promise<void>}
 */
export const setPersistenceMode = async (rememberMe) => {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
    );
  } catch (error) {
    throw new Error(`Failed to set persistence: ${error.message}`);
  }
};
