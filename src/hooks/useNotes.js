import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import * as noteService from '../services/noteService';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const useNotes = () => {
  const [state, localDispatch] = useReducer(notesReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    localDispatch({ type: 'SET_LOADING', payload: true });

    const q = query(collection(db, COLLECTIONS.NOTES), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        localDispatch({ type: 'SET_NOTES', payload: notesList });
      },
      (error) => {
        localDispatch({ type: 'SET_ERROR', payload: error.message });
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchNotes = useCallback(async () => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notes = await noteService.getNotes();
      localDispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createNote = useCallback(async (data) => {
    try {
      const note = await noteService.createNote(data);
      return note;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updateNote = useCallback(async (id, data) => {
    try {
      const note = await noteService.updateNote(id, data);
      return note;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      await noteService.deleteNote(id);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const archiveNote = useCallback(async (id) => {
    try {
      const note = await noteService.archiveNote(id);
      return note;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const pinNote = useCallback(async (id) => {
    try {
      const note = await noteService.pinNote(id);
      return note;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const searchNotes = useCallback(async (queryStr) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notes = await noteService.searchNotes(queryStr);
      localDispatch({ type: 'SET_NOTES', payload: notes });
      return notes;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  return {
    notes: state.notes,
    loading: state.loading,
    error: state.error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    pinNote,
    searchNotes,
  };
};

export default useNotes;
