import { NavLink } from 'react-router-dom';
import {
  FiUser,
  FiMapPin,
  FiLock,
  FiShoppingBag,
  FiLogOut,
} from 'react-icons/fi';

import useLogout from '../../hooks/useLogout';
import Button from '../../ui/Button';

const navItems = [
  { to: 'profile', label: 'Profile', icon: FiUser },
  { to: 'addresses', label: 'Addresses', icon: FiMapPin },
  { to: 'password', label: 'Password', icon: FiLock },
  { to: 'orders', label: 'Orders', icon: FiShoppingBag },
];

function AccountNav() {
  const { mutate: logout } = useLogout();

  const baseItem =
    'relative flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 md:w-full';

  return (
    <nav className="w-full rounded-xl border border-border bg-surface p-3 shadow-soft">
      {/* Navigation heading */}
      <div className="hidden px-3 pb-4 pt-2 md:block">
        <span className="section-label">Account settings</span>
        <h3 className="mt-1 font-serif text-xl text-foreground">My Account</h3>
      </div>

      {/* Navigation links */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${baseItem} ${
                isActive
                  ? 'bg-surface-hover text-foreground'
                  : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full transition-colors md:bottom-2 md:left-0 md:right-auto md:top-2 md:h-auto md:w-0.5 ${
                    isActive ? 'bg-primary' : 'bg-transparent'
                  }`}
                />

                <Icon
                  size={18}
                  className={`shrink-0 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />

                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-3 border-t border-border pt-3">
        <Button variant="menuDanger" fullWidth onClick={() => logout()}>
          <span className="flex items-center justify-center gap-2 md:justify-start">
            <FiLogOut size={17} />
            Logout
          </span>
        </Button>
      </div>
    </nav>
  );
}

export default AccountNav;
