import { Outlet } from 'react-router-dom';

const SimpleAuthLayout = () => (
  <div className="auth-page" style={{ padding: '40px 24px' }}>
    <Outlet />
  </div>
);

export default SimpleAuthLayout;
