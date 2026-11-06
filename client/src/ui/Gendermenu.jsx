import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import SpinnerMini from './SpinnerMini';

function GenderMenu({ gender, data = [], onClose }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const activeSubs =
    data.find((c) => c._id === activeCategory)?.subcategories ?? [];

  return (
    <div
      className="absolute left-0 top-full z-50 flex gap-8 border border-border bg-surface px-8 py-6 text-foreground shadow-xl"
      style={{ minWidth: '480px' }}
      onMouseLeave={onClose}
    >
      {data.length === 0 ? (
        <div className="flex min-h-20 w-full items-center justify-center">
          <SpinnerMini />
        </div>
      ) : (
        <>
          <div className="min-w-40">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Categories
            </p>

            <div className="space-y-1">
              {data.map((cat) => (
                <div
                  key={cat._id}
                  onMouseEnter={() => setActiveCategory(cat._id)}
                  className={`text-sm transition-colors ${
                    activeCategory === cat._id
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <NavLink
                    to={`/products?gender=${gender}&category=${cat._id}`}
                    onClick={onClose}
                    className="block py-1.5"
                  >
                    {cat.name}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {activeSubs.length > 0 && (
            <>
              <div className="w-px self-stretch bg-border" />

              <div className="min-w-40">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Subcategories
                </p>

                <div className="space-y-1">
                  {activeSubs.map((sub) => (
                    <div key={sub._id} className="text-sm">
                      <NavLink
                        to={`/products?gender=${gender}&category=${activeCategory}&subcategory=${sub._id}`}
                        onClick={onClose}
                        className="block py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {sub.name}
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default GenderMenu;
