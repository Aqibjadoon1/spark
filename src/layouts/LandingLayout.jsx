import { Outlet } from 'react-router-dom';

const LandingLayout = () => (
  <main className="app-main" style={{ margin: 0, maxWidth: 'none' }}>
    <Outlet />
  </main>
);

export default LandingLayout;
