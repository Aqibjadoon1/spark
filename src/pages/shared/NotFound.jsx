import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: 72, fontWeight: 700, color: '#5A55CA', marginBottom: 16 }}>404</h1>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: '#1A1A2E' }}>Page not found</h2>
        <p style={{ color: '#6B7280', marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button onClick={() => navigate(ROUTES.HOME)} className="btn btn-primary btn-lg">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
