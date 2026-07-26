import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SmallScreenNav from './SmallScreenNav';

const HEADER_HEIGHT = 80;
const BOTTOM_NAV_HEIGHT = 72;

function AppLayout() {
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main
        className="min-h-[calc(100vh)]"
        style={{
          paddingTop: isHome ? 0 : HEADER_HEIGHT, // make hero section below header and header transparent
          paddingBottom: BOTTOM_NAV_HEIGHT,
        }}
      >
        <Outlet />
      </main>

      <Footer />

      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-white md:hidden"
        style={{ height: BOTTOM_NAV_HEIGHT }}
      >
        <SmallScreenNav />
      </div>
    </div>
  );
}

export default AppLayout;
