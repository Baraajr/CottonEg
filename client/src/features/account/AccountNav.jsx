import { NavLink } from 'react-router-dom';
import { FiUser, FiMapPin, FiLock, FiShoppingBag } from 'react-icons/fi';
import { CiLogout } from 'react-icons/ci';

import useLogout from '../../hooks/useLogout';

const navItems = [
  { to: 'profile', label: 'Profile', icon: FiUser },
  { to: 'addresses', label: 'Addresses', icon: FiMapPin },
  { to: 'password', label: 'Password', icon: FiLock },
  { to: 'orders', label: 'Orders', icon: FiShoppingBag },
];

function AccountNav() {
  const { mutate: logout } = useLogout();

  const baseItem =
    'relative flex shrink-0 md:w-full items-center justify-center md:justify-start gap-2 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200';

  return (
    <nav className="w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
      {/* Desktop title */}
      <div className="hidden px-3 py-2 text-xs font-semibold uppercase text-gray-400 md:block">
        Account
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:flex-col md:gap-1 md:overflow-visible md:pb-0">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${baseItem} ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                <span
                  className={`absolute transition-colors duration-200
                    left-2 right-2 bottom-0 h-1 rounded-t-full
                    md:left-0 md:right-auto md:top-2 md:bottom-2 md:h-auto md:w-1 md:rounded-r-full md:rounded-t-none
                    ${isActive ? 'bg-black' : 'bg-transparent'}
                  `}
                />

                <Icon
                  size={18}
                  className={isActive ? 'text-black' : 'text-gray-500'}
                />

                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-3 border-t border-gray-100 pt-3">
        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 md:justify-start"
        >
          <CiLogout size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default AccountNav;
