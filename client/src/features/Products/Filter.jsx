import { useState, useEffect } from 'react';
import useSubCategories from '../../hooks/useSubCategories';

function Filter({ filters, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const [showSubcategory, setShowSubcategory] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  const { subcategory, category, priceRange, gender } = localFilters;
  const [minPrice, maxPrice] = priceRange;

  const { subcategories = [] } = useSubCategories({
    gender,
    category,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateLocal = (patch) =>
    setLocalFilters((prev) => ({
      ...prev,
      ...patch,
    }));

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const reset = {
      category,
      gender,
      subcategory: '',
      priceRange: [100, 60000],
    };

    setLocalFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="w-full flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-6 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>

        <button
          onClick={onClose}
          className="text-xl text-gray-500 hover:text-black leading-none"
          aria-label="Close filters"
        >
          ×
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
        {/* SUBCATEGORIES */}
        <div>
          <button
            type="button"
            onClick={() => setShowSubcategory((v) => !v)}
            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Collections
            <span
              className={`w-2.5 h-2.5 border-r-2 border-b-2 border-gray-400 transition-transform duration-300 ${
                showSubcategory ? 'rotate-[-135deg]' : 'rotate-45'
              }`}
            />
          </button>

          <div
            className={`overflow-auto  transition-all duration-300 ease-in-out ${
              showSubcategory
                ? 'max-h-96 opacity-100 mt-3'
                : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="space-y-2">
              {subcategories.map((sub) => (
                <label
                  key={sub._id}
                  className={`flex items-center justify-between rounded border px-3 py-2 cursor-pointer transition ${
                    subcategory === sub._id
                      ? 'border-black bg-gray-50 text-black'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">{sub.name}</span>

                  <input
                    type="radio"
                    name="subcategory"
                    value={sub._id}
                    checked={subcategory === sub._id}
                    onChange={() =>
                      updateLocal({
                        subcategory: sub._id,
                      })
                    }
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PRICE */}
        <div>
          <button
            type="button"
            onClick={() => setShowPrice((v) => !v)}
            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Price
            <span
              className={`w-2.5 h-2.5 border-r-2 border-b-2 border-gray-400 transition-transform duration-300 ${
                showPrice ? 'rotate-[-135deg]' : 'rotate-45'
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showPrice ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                step={100}
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const num = value === '' ? 0 : Number(value);

                  updateLocal({
                    priceRange: [Math.min(num, maxPrice), maxPrice],
                  });
                }}
                className="w-full rounded border px-3 py-2 text-sm"
              />

              <input
                type="number"
                placeholder="Max"
                step={100}
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const num = value === '' ? 0 : Number(value);

                  updateLocal({
                    priceRange: [minPrice, Math.max(num, minPrice)],
                  });
                }}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">Enter any price range</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full px-8 py-4 border-t bg-white sticky bottom-0">
        <div className="flex gap-3">
          <button
            onClick={resetFilters}
            className="flex-1 h-11 border border-gray-300 text-sm hover:bg-gray-50 transition"
          >
            Reset
          </button>

          <button
            onClick={applyFilters}
            className="flex-1 h-11 bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
