/**
 * Firestore service for posts.
 * @module services/postService
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';

const postsRef = collection(db, 'posts');

/**
 * Create a new post.
 * @param {Object} postData
 * @param {string} postData.authorId
 * @param {string} postData.authorName
 * @param {string} postData.authorPhoto
 * @param {string} postData.title
 * @param {string} postData.content
 * @param {string[]} [postData.tags]
 * @param {string} [postData.category]
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export const createPost = async (postData) => {
  try {
    const data = {
      authorId: postData.authorId,
      authorName: postData.authorName,
      authorPhoto: postData.authorPhoto,
      title: postData.title,
      content: postData.content,
      image: postData.image || '',
      tags: postData.tags || [],
      category: postData.category || '',
      reactions: {},
      commentsCount: 0,
      viewCount: 0,
      reactionCount: 0,
      isEdited: false,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(postsRef, data);
    return docRef;
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

/**
 * Update an existing post.
 * @param {string} postId
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export const updatePost = async (postId, updates) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, { ...updates, isEdited: true });
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
};

/**
 * Delete a post.
 * @param {string} postId
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await deleteDoc(postDoc);
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

/**
 * Fetch posts with optional category filter and sort order.
 * @param {string} [category]
 * @param {string} [sortBy='createdAt']
 * @param {number} [limitCount=10]
 * @returns {Promise<Array<{id: string, data: Object}>>}
 */
export const getPosts = async (category, sortBy = 'createdAt', limitCount = 10) => {
  try {
    const constraints = [];

    if (category) {
      constraints.push(where('category', '==', category));
    }

    constraints.push(orderBy(sortBy, 'desc'));
    constraints.push(limitCount);

    const q = query(postsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};

/**
 * Get a single post by ID.
 * @param {string} postId
 * @returns {Promise<Object|null>}
 */
export const getPostById = async (postId) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    const snapshot = await getDoc(postDoc);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
};

/**
 * Subscribe to real-time post updates.
 * @param {(posts: Array) => void} callback
 * @param {string} [category]
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export const subscribeToPosts = (callback, category) => {
  try {
    const constraints = [];

    if (category) {
      constraints.push(where('category', '==', category));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(postsRef, ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(posts);
      },
      (error) => {
        throw new Error(`Post subscription error: ${error.message}`);
      },
    );
  } catch (error) {
    throw new Error(`Failed to subscribe to posts: ${error.message}`);
  }
};

/**
 * React to a post with an emoji.
 * @param {string} postId
 * @param {string} emoji
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const reactToPost = async (postId, emoji, userId) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, {
      [`reactions.${emoji}`]: increment(1),
      reactionCount: increment(1),
    });
  } catch (error) {
    throw new Error(`Failed to react to post: ${error.message}`);
  }
};

/**
 * Remove a reaction from a post.
 * @param {string} postId
 * @param {string} emoji
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const removeReaction = async (postId, emoji, userId) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, {
      [`reactions.${emoji}`]: increment(-1),
      reactionCount: increment(-1),
    });
  } catch (error) {
    throw new Error(`Failed to remove reaction: ${error.message}`);
  }
};

/**
 * Add a comment to a post and increment the comment count.
 * @param {string} postId
 * @param {Object} comment
 * @returns {Promise<void>}
 */
export const addComment = async (postId, comment) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    await addDoc(commentsRef, {
      ...comment,
      createdAt: serverTimestamp(),
    });

    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, {
      commentsCount: increment(1),
    });
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
};

/**
 * Increment the view count of a post.
 * @param {string} postId
 * @returns {Promise<void>}
 */
export const incrementViewCount = async (postId) => {
  try {
    const postDoc = doc(db, 'posts', postId);
    await updateDoc(postDoc, {
      viewCount: increment(1),
    });
  } catch (error) {
    throw new Error(`Failed to increment view count: ${error.message}`);
  }
};

/**
 * Get all comments for a post, ordered by creation time.
 * @param {string} postId
 * @returns {Promise<Array>}
 */
export const getComments = async (postId) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};
