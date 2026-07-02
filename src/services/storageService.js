/**
 * Firebase Storage service.
 * @module services/storageService
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebaseSDK';

// Re-export storage helpers for older callsites
// (e.g. Feed.jsx imports { ref, storage } from this module)
export { ref, storage };


/**
 * Upload a profile image for a user.
 * @param {string} uid
 * @param {File} file
 * @returns {Promise<string>} Download URL
 */
export const uploadProfileImage = async (uid, file) => {
  try {
    const storageRef = ref(storage, `profiles/${uid}/photo.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw new Error(`Failed to upload profile image: ${error.message}`);
  }
};

/**
 * Upload an image for a post.
 * @param {string} postId
 * @param {File} file
 * @returns {Promise<string>} Download URL
 */
export const uploadPostImage = async (postId, file) => {
  try {
    const storageRef = ref(storage, `posts/${postId}/image`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw new Error(`Failed to upload post image: ${error.message}`);
  }
};

/**
 * Delete a file at the given storage path.
 * @param {string} path - Storage path (e.g. 'profiles/{uid}/photo.jpg')
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get a download URL for a file at the given storage path.
 * @param {string} path - Storage path
 * @returns {Promise<string>}
 */
export const getFileDownloadURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw new Error(`Failed to get download URL: ${error.message}`);
  }
};
