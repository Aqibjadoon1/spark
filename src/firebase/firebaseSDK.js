import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import firebaseConfig from './firebaseConfig';

let app = null;
let auth = null;
let db = null;
let storage = null;
let firebaseAvailable = false;

try {
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;
  if (!hasConfig) {
    console.warn(
      '%c[Spark] Firebase not configured. Set VITE_FIREBASE_* env vars in .env.local',
      'color: #B9FF66; font-weight: bold;'
    );
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
    storage = getStorage(app);
    firebaseAvailable = true;
  }
} catch (error) {
  console.warn('[Spark] Firebase initialization failed:', error.message);
}

export const setAuthPersistence = async (rememberMe) => {
  if (!auth) return;
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  } catch (error) {
    console.error('Auth persistence error:', error);
  }
};

export const isFirebaseAvailable = () => firebaseAvailable;

export { app, auth, db, storage, firebaseAvailable };
export default app;
