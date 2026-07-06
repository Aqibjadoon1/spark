import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const getDateKey = () => new Date().toISOString().split('T')[0];

const ensureDailyDoc = async (dateKey) => {
  const ref = doc(db, COLLECTIONS.ANALYTICS, dateKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      date: dateKey,
      postCategories: { technology: 0, lifestyle: 0, sports: 0, entertainment: 0, general: 0 },
      userActivity: { registrations: 0, logins: 0, postsCreated: 0, commentsMade: 0 },
      createdAt: serverTimestamp(),
    });
  }
  return ref;
};

export const trackPostCreated = async (category) => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    const field = `postCategories.${category}`;
    await updateDoc(ref, { [field]: increment(1), 'userActivity.postsCreated': increment(1) });
  } catch (error) {
    console.error('Analytics trackPostCreated error:', error);
  }
};

export const trackLogin = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.logins': increment(1) });
  } catch (error) {
    console.error('Analytics trackLogin error:', error);
  }
};

export const trackRegistration = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.registrations': increment(1) });
  } catch (error) {
    console.error('Analytics trackRegistration error:', error);
  }
};

export const trackComment = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.commentsMade': increment(1) });
  } catch (error) {
    console.error('Analytics trackComment error:', error);
  }
};

export const getAnalytics = async (dateKey) => {
  try {
    const ref = doc(db, COLLECTIONS.ANALYTICS, dateKey || getDateKey());
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
};
