import { NavLink } from 'react-router-dom';

const links = [
  { to: 'dashboard', label: 'Dashboard' },
  { to: 'products', label: 'Products' },
  { to: 'categories', label: 'Categories' },
  { to: 'subcategories', label: 'Subcategories' },
  { to: 'orders', label: 'Orders' },
  { to: 'users', label: 'Users' },
];

function AdminNav({ onClickItem }) {
  const base =
    'relative rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200';

  const active = 'bg-primary text-primary-foreground';

  const inactive =
    'text-muted-foreground hover:bg-accent hover:text-foreground';

  return (
    <nav className="flex flex-col gap-1.5 ">
      {links.map(({ to, label }) => (
        <NavLink
          onClick={onClickItem}
          key={to}
          to={to}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default AdminNav;
