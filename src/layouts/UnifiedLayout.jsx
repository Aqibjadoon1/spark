import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/globals/Navbar';
import LeftSidebar from '../components/globals/LeftSidebar';
import FeedRightSidebar from '../components/feed/FeedRightSidebar';

const UnifiedLayout = () => {
  const location = useLocation();
  const showRightSidebar = ['/feed', '/trending', '/bookmarks', '/nearby'].includes(location.pathname);

  return (
    <>
      <Navbar />
      <div className={`unified-layout${showRightSidebar ? '' : ' layout--full'}`}>
        <LeftSidebar />
        <main className="unified-content">
          <Outlet />
        </main>
        {showRightSidebar && (
          <aside className="unified-right">
            <FeedRightSidebar />
          </aside>
        )}
      </div>
    </>
  );
};

export default UnifiedLayout;
