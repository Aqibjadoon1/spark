import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const notifRef = () => collection(db, COLLECTIONS.NOTIFICATIONS);

export const createNotification = async (data) => {
  try {
    const docRef = await addDoc(notifRef(), {
      userId: data.userId,
      type: data.type,
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      fromUserPhoto: data.fromUserPhoto || '',
      targetId: data.targetId || '',
      targetType: data.targetType || '',
      message: data.message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

export const markNotificationRead = async (notifId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notifId), { read: true });
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

export const markAllNotificationsRead = async (userId) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((d) => updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, d.id), { read: true }));
    await Promise.all(updates);
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

export const subscribeToNotifications = (userId, callback) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(notifs);
    }, (error) => {
      throw new Error(`Notification subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to notifications: ${error.message}`);
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};
