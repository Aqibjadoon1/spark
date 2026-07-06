import { useState, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase/firebaseSDK';
import { setUser, setAuthLoading } from './redux/actions/authActions';
import routes from './routes/routes.jsx';
import Loader from './components/globals/Loader';
import SplashScreen from './components/ui/SplashScreen';
import { seedDummyData } from './services/seedData';
import { trackLogin } from './services/analyticsService';
import { COLLECTIONS } from './constants/firestoreCollections';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            name: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL || '',
            role: 'user',
            friends: [],
            friendRequests: [],
            createdAt: new Date().toISOString(),
          });
        }
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: snap.exists() ? snap.data().role : 'user',
        }));
        seedDummyData();
        trackLogin();
      } else {
        dispatch(setUser(null));
      }
      dispatch(setAuthLoading(false));
    });
    return () => unsub();
  }, [dispatch]);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (loading) return <Loader fullScreen />;
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;
