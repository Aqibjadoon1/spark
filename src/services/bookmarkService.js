import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';

export const addBookmark = async (uid, postId) => {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, { bookmarks: arrayUnion(postId) });
};

export const removeBookmark = async (uid, postId) => {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, { bookmarks: arrayRemove(postId) });
};
