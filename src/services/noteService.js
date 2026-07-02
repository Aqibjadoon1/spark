import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const col = collection(db, COLLECTIONS.NOTES);

export const createNote = async (data) => {
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() });
  return ref.id;
};

export const updateNote = async (id, updates) => {
  await updateDoc(doc(db, COLLECTIONS.NOTES, id), updates);
};

export const deleteNote = async (id) => {
  await deleteDoc(doc(db, COLLECTIONS.NOTES, id));
};

export const getNotes = async (queryConstraints = []) => {
  const q = query(col, ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getNoteById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTIONS.NOTES, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const archiveNote = async (id) => {
  await updateNote(id, { isArchived: true });
};

export const pinNote = async (id) => {
  await updateNote(id, { isPinned: true });
};

export const searchNotes = async (searchTerm) => {
  const all = await getNotes();
  const term = searchTerm.toLowerCase();
  return all.filter(
    (n) =>
      n.title?.toLowerCase().includes(term) ||
      n.content?.toLowerCase().includes(term),
  );
};

export const subscribeToNotes = (callback, queryConstraints = []) => {
  const q = query(col, orderBy('createdAt', 'desc'), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notes);
  });
};
