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

  const baseItem = 'flex flex-col items-center gap-1 min-w-[64px] select-none';

  const iconBase =
    'w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200';

  const iconClass = (active) =>
    `${iconBase} ${
      active
        ? 'bg-gray-900 text-white scale-[1.03]'
        : 'text-gray-500 hover:bg-gray-100'
    }`;

  const labelClass = (active) =>
    `text-[11px] transition ${
      active ? 'text-gray-900 font-medium' : 'text-gray-500'
    }`;

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/account');
  };

  return (
    <div
      className="
          md:hidden fixed bottom-0 inset-x-0 z-50
          bg-white/90 backdrop-blur-xl
          border-t border-gray-200
          shadow-[0_-10px_25px_rgba(0,0,0,0.06)]
          px-3 py-2
        "
    >
      <div className="flex justify-between items-end">
        {/* Home */}
        <div className={baseItem} onClick={() => navigate('/')}>
          <div className={iconClass(isActive('/'))}>
            <IoHomeOutline size={20} />
          </div>
          <span className={labelClass(isActive('/'))}>Home</span>
        </div>

        {user?.role === 'admin' ? (
          <div className={baseItem} onClick={() => navigate('/admin')}>
            <div className={iconClass(isActive('/admin'))}>
              <RiDashboardLine size={20} />
            </div>
            <span className={labelClass(isActive('/admin'))}>Admin</span>
          </div>
        ) : (
          <>
            {' '}
            {/* wishlist */}
            <div className={baseItem} onClick={() => navigate('/wishlist')}>
              <div className={iconClass(isActive('/wishlist'))}>
                <FaRegHeart size={18} />
              </div>
              <span className={labelClass(isActive('/wishlist'))}>
                Wishlist
              </span>
            </div>
            {/* Cart */}
            <div className={baseItem} onClick={() => navigate('/cart')}>
              <div className={iconClass(isActive('/cart'))}>
                <IoCartOutline size={20} />
              </div>
              <span className={labelClass(isActive('/cart'))}>Cart</span>
            </div>
          </>
        )}

        {/* Profile */}
        <div className="relative flex flex-col items-center gap-1 min-w-16">
          <button onClick={handleProfileClick} className="outline-none">
            <div className={iconClass(isActive('/account'))}>
              <IoPersonOutline size={20} />
            </div>
          </button>

          <span className={labelClass(isActive('/account/*'))}>
            {user ? 'Profile' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SmallScreenNav;
