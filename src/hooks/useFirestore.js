import { useReducer, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

function firestoreReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const useFirestore = (collectionName) => {
  const [state, dispatch] = useReducer(firestoreReducer, initialState);

  const addDocument = useCallback(
    async (data) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const docRef = await addDoc(collection(db, collectionName), data);
        const newDoc = { id: docRef.id, ...data };
        return newDoc;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    [collectionName]
  );

  const updateDocument = useCallback(
    async (id, data) => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    [collectionName]
  );

  const deleteDocument = useCallback(
    async (id) => {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    [collectionName]
  );

  const getDocument = useCallback(
    async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    [collectionName]
  );

  const getDocuments = useCallback(
    async (queryConstraints) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const q = queryConstraints
          ? query(collection(db, collectionName), ...queryConstraints)
          : query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        dispatch({ type: 'SET_DATA', payload: docs });
        return docs;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    [collectionName]
  );

  const subscribeToCollection = useCallback(
    (callback, queryConstraints) => {
      const q = queryConstraints
        ? query(collection(db, collectionName), ...queryConstraints)
        : query(collection(db, collectionName));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          dispatch({ type: 'SET_DATA', payload: docs });
          if (callback) callback(docs);
        },
        (error) => {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      );

      return unsubscribe;
    },
    [collectionName]
  );

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getDocuments,
    subscribeToCollection,
  };
};

export default useFirestore;
