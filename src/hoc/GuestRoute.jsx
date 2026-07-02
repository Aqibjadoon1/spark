import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const { user, loading } = useSelector(s => s.auth);
  if (loading) return null;
  if (user) return <Navigate to="/feed" replace />;
  return children;
};

export default GuestRoute;
