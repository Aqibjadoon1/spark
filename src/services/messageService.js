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

export const createConversation = async (participants) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
      participants,
      lastMessage: { text: '', senderId: '', createdAt: serverTimestamp() },
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }
};

export const sendMessage = async (conversationId, senderId, senderName, senderPhoto, text) => {
  try {
    const msgRef = collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages');
    const msgDoc = await addDoc(msgRef, {
      senderId,
      senderName,
      senderPhoto: senderPhoto || '',
      text,
      read: false,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
      lastMessage: { text, senderId, createdAt: serverTimestamp() },
    });
    return msgDoc;
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

export const subscribeToConversations = (userId, callback) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(convs);
    }, (error) => {
      throw new Error(`Conversation subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to conversations: ${error.message}`);
  }
};

export const subscribeToMessages = (conversationId, callback) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(msgs);
    }, (error) => {
      throw new Error(`Messages subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to messages: ${error.message}`);
  }
};

export const markMessagesRead = async (conversationId, userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages'),
      where('read', '==', false),
      where('senderId', '!=', userId)
    );
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((d) => updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages', d.id), { read: true }));
    await Promise.all(updates);
  } catch (error) {
    throw new Error(`Failed to mark messages read: ${error.message}`);
  }
};
