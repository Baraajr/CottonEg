import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { IoHomeOutline, IoPersonOutline, IoCartOutline } from 'react-icons/io5';
import { RiDashboardLine } from 'react-icons/ri';
import { FaRegHeart } from 'react-icons/fa';

import useUser from '../hooks/useUser';

function SmallScreenNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = useUser();
  const user = data?.data;

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return !!matchPath({ path, end: false }, location.pathname);
  };

  const baseItem =
    'flex min-w-[64px] flex-col items-center gap-1 select-none cursor-pointer';

  const iconBase =
    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200';

  const iconClass = (active) =>
    `${iconBase} ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  const labelClass = (active) =>
    `text-[10px] transition-colors ${
      active ? 'font-semibold text-foreground' : 'text-muted-foreground'
    }`;

  const handleProfileClick = () => {
    navigate(user ? '/account' : '/login');
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-foreground shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden">
      <div className="flex items-end justify-between">
        {/* Home */}
        <button
          type="button"
          className={baseItem}
          onClick={() => navigate('/')}
        >
          <div className={iconClass(isActive('/'))}>
            <IoHomeOutline size={20} />
          </div>
          <span className={labelClass(isActive('/'))}>Home</span>
        </button>

        {user?.role === 'admin' ? (
          <button
            type="button"
            className={baseItem}
            onClick={() => navigate('/admin')}
          >
            <div className={iconClass(isActive('/admin'))}>
              <RiDashboardLine size={20} />
            </div>
            <span className={labelClass(isActive('/admin'))}>Admin</span>
          </button>
        ) : (
          <>
            {/* Wishlist */}
            <button
              type="button"
              className={baseItem}
              onClick={() => navigate('/wishlist')}
            >
              <div className={iconClass(isActive('/wishlist'))}>
                <FaRegHeart size={18} />
              </div>
              <span className={labelClass(isActive('/wishlist'))}>
                Wishlist
              </span>
            </button>

            {/* Cart */}
            <button
              type="button"
              className={baseItem}
              onClick={() => navigate('/cart')}
            >
              <div className={iconClass(isActive('/cart'))}>
                <IoCartOutline size={20} />
              </div>
              <span className={labelClass(isActive('/cart'))}>Cart</span>
            </button>
          </>
        )}

        {/* Profile */}
        <button type="button" onClick={handleProfileClick} className={baseItem}>
          <div className={iconClass(isActive('/account'))}>
            <IoPersonOutline size={20} />
          </div>
          <span className={labelClass(isActive('/account'))}>
            {user ? 'Profile' : 'Login'}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default SmallScreenNav;
