import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const col = collection(db, COLLECTIONS.TASKS);

export const createTask = async (data) => {
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() });
  return ref.id;
};

export const updateTask = async (id, updates) => {
  await updateDoc(doc(db, COLLECTIONS.TASKS, id), updates);
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, COLLECTIONS.TASKS, id));
};

export const getTasks = async (queryConstraints = []) => {
  const q = query(col, ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getTaskById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTIONS.TASKS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const filterByStatus = async (status) => {
  const q = query(col, where('status', '==', status));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const filterByPriority = async (priority) => {
  const q = query(col, where('priority', '==', priority));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const searchTasks = async (searchTerm) => {
  const all = await getTasks();
  const term = searchTerm.toLowerCase();
  return all.filter(
    (t) =>
      t.title?.toLowerCase().includes(term) ||
      t.description?.toLowerCase().includes(term),
  );
};

export const sortTasks = async (by) => {
  const q = query(col, orderBy(by, 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeToTasks = (callback, queryConstraints = []) => {
  const q = query(col, orderBy('createdAt', 'desc'), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
};
