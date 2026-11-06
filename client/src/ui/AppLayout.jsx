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
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />

      <main
        className="min-h-screen min-w-0 md:pb-0!"
        style={{
          paddingTop: isHome ? 0 : HEADER_HEIGHT,
          paddingBottom: `var(--bottom-nav-height)`,
          '--bottom-nav-height': `${BOTTOM_NAV_HEIGHT}px`,
        }}
      >
        <Outlet />
        <Footer />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 h-18 border-t border-border bg-background md:hidden">
        <SmallScreenNav />
      </div>
    </div>
  );
}

export default AppLayout;
