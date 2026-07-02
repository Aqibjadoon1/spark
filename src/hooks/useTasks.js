import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import * as taskService from '../services/taskService';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

function tasksReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const useTasks = () => {
  const [state, localDispatch] = useReducer(tasksReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    localDispatch({ type: 'SET_LOADING', payload: true });

    const q = query(collection(db, COLLECTIONS.TASKS), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        localDispatch({ type: 'SET_TASKS', payload: tasksList });
      },
      (error) => {
        localDispatch({ type: 'SET_ERROR', payload: error.message });
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchTasks = useCallback(async () => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await taskService.getTasks();
      localDispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createTask = useCallback(async (data) => {
    try {
      const task = await taskService.createTask(data);
      return task;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    try {
      const task = await taskService.updateTask(id, data);
      return task;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.deleteTask(id);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const filterByStatus = useCallback(async (status) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await taskService.filterByStatus(status);
      localDispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const filterByPriority = useCallback(async (priority) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await taskService.filterByPriority(priority);
      localDispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const searchTasks = useCallback(async (queryStr) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await taskService.searchTasks(queryStr);
      localDispatch({ type: 'SET_TASKS', payload: tasks });
      return tasks;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const sortTasks = useCallback(async (by) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await taskService.sortTasks(by);
      localDispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    filterByStatus,
    filterByPriority,
    searchTasks,
    sortTasks,
  };
};

export default useTasks;
