import { NavLink } from 'react-router-dom';

const links = [
  { to: 'dashboard', label: 'Dashboard' },
  { to: 'products', label: 'Products' },
  { to: 'categories', label: 'Categories' },
  { to: 'subcategories', label: 'Subcategories' },
  { to: 'orders', label: 'Orders' },
  { to: 'users', label: 'Users' },
];

function AdminNav() {
  const base =
    'relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200';

  const active = 'text-black after:scale-x-100';

  const underline =
    'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-black after:origin-left after:scale-x-0 after:transition-transform';

  return (
    <nav className="flex flex-col gap-6">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${base} ${underline} hover:text-black hover:after:scale-x-100 ${
              isActive ? active : ''
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default AdminNav;
