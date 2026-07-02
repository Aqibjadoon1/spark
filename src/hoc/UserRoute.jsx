import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const { user, loading } = useSelector(s => s.auth);
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

export default UserRoute;
