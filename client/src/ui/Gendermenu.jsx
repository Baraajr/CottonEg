import { useState } from 'react';
import SpinnerMini from './SpinnerMini';
import { NavLink } from 'react-router-dom';

function GenderMenu({ gender, data = [], onClose }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const activeSubs =
    data.find((c) => c._id === activeCategory)?.subcategories ?? [];

  return (
    <div
      className="absolute top-full left-0 bg-white border border-gray-200 flex gap-8 px-8 py-6 z-50"
      style={{ minWidth: '480px' }}
      onMouseLeave={onClose}
    >
      {data.length === 0 ? (
        <SpinnerMini />
      ) : (
        <>
          <div className="min-w-40">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Category
            </p>

            {data.map((cat) => (
              <div
                key={cat._id}
                onMouseEnter={() => setActiveCategory(cat._id)}
                className={`text-sm py-1.5 cursor-pointer transition-colors ${
                  activeCategory === cat._id
                    ? 'text-black font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <NavLink
                  to={`/products?gender=${gender}&category=${cat._id}`}
                  onClick={onClose}
                >
                  {cat.name}
                </NavLink>
              </div>
            ))}
          </div>

          {activeSubs.length > 0 && (
            <div className="w-px bg-gray-100 self-stretch" />
          )}

          {activeSubs.length > 0 && (
            <div className="min-w-40">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Subcategory
              </p>

              {activeSubs.map((sub) => (
                <div key={sub._id} className="text-sm py-1.5">
                  <NavLink
                    to={`/products?gender=${gender}&category=${activeCategory}&subcategory=${sub._id}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {sub.name}
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GenderMenu;
