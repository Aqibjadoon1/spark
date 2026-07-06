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
import { COLLECTIONS } from '../constants/firestoreCollections';

const getPostRef = (collectionName = COLLECTIONS.POSTS) => collection(db, collectionName);
const getPostDocRef = (postId, collectionName = COLLECTIONS.POSTS) => doc(db, collectionName, postId);

export const createPost = async (postData, collectionName = COLLECTIONS.POSTS) => {
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
    return await addDoc(getPostRef(collectionName), data);
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

export const updatePost = async (postId, updates, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), { ...updates, isEdited: true });
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
};

export const deletePost = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await deleteDoc(getPostDocRef(postId, collectionName));
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

export const getPosts = async (category, sortBy = 'createdAt', limitCount = 10, collectionName = COLLECTIONS.POSTS) => {
  try {
    const constraints = [];
    if (category) constraints.push(where('category', '==', category));
    constraints.push(orderBy(sortBy, 'desc'), limitCount);
    const q = query(getPostRef(collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data(), ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};

export const getPostById = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    const snapshot = await getDoc(getPostDocRef(postId, collectionName));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
};

export const subscribeToPosts = (callback, category, collectionName = COLLECTIONS.POSTS) => {
  try {
    const constraints = [];
    if (category) constraints.push(where('category', '==', category));
    constraints.push(orderBy('createdAt', 'desc'));
    const q = query(getPostRef(collectionName), ...constraints);
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      throw new Error(`Post subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to posts: ${error.message}`);
  }
};

export const reactToPost = async (postId, emoji, userId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), {
      [`reactions.${emoji}`]: increment(1),
      reactionCount: increment(1),
    });
  } catch (error) {
    throw new Error(`Failed to react to post: ${error.message}`);
  }
};

export const removeReaction = async (postId, emoji, userId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), {
      [`reactions.${emoji}`]: increment(-1),
      reactionCount: increment(-1),
    });
  } catch (error) {
    throw new Error(`Failed to remove reaction: ${error.message}`);
  }
};

export const addComment = async (postId, comment, collectionName = COLLECTIONS.POSTS) => {
  try {
    const commentsRef = collection(db, collectionName, postId, 'comments');
    await addDoc(commentsRef, { ...comment, createdAt: serverTimestamp() });
    await updateDoc(getPostDocRef(postId, collectionName), { commentsCount: increment(1) });
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
};

export const incrementViewCount = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), { viewCount: increment(1) });
  } catch (error) {
    throw new Error(`Failed to increment view count: ${error.message}`);
  }
};

export const getComments = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    const commentsRef = collection(db, collectionName, postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};
