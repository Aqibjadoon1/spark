import { useState, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
    seedDummyData();
  }, []);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: snap.exists() ? snap.data().role : 'user',
        }));
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
