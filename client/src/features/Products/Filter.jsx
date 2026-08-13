import { useState, useEffect } from 'react';
import useSubCategories from '../../hooks/useSubCategories';
import Button from '../../ui/Button';

function Filter({ filters, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const [showSubcategory, setShowSubcategory] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const {
    subcategory,
    category,
    priceRange,
    gender,
    featured = 'all',
    stock = 'all',
    size = '',
    color = '',
  } = localFilters;

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
      featured: 'all',
      stock: 'all',
      size: '',
      color: '',
    };

    setLocalFilters(reset);
    onFilterChange(reset);
  };

  const sections = [
    {
      title: 'Collections',
      open: showSubcategory,
      setOpen: setShowSubcategory,
      content: (
        <div className="space-y-2">
          {subcategories.map((sub) => (
            <label
              key={sub._id}
              className={`group flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 ${
                subcategory === sub._id
                  ? 'border-black bg-black text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{sub.name}</span>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                  subcategory === sub._id
                    ? 'border-white'
                    : 'border-gray-300 group-hover:border-gray-500'
                }`}
              >
                {subcategory === sub._id && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>

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
      ),
    },
    {
      title: 'Price',
      open: showPrice,
      setOpen: setShowPrice,
      content: (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Minimum
              </label>

              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 transition focus-within:border-black focus-within:bg-white">
                <span className="text-xs text-gray-400">EGP</span>

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
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Maximum
              </label>

              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 transition focus-within:border-black focus-within:bg-white">
                <span className="text-xs text-gray-400">EGP</span>

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
                  className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Set your preferred price range.
          </p>
        </div>
      ),
    },
    {
      title: 'Featured',
      open: showFeatured,
      setOpen: setShowFeatured,
      content: (
        <div className="space-y-2">
          {[
            { label: 'All Products', value: 'all' },
            { label: 'Featured Only', value: 'true' },
            { label: 'Not Featured', value: 'false' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`group flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 ${
                featured === opt.value
                  ? 'border-black bg-black text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  featured === opt.value
                    ? 'border-white'
                    : 'border-gray-300 group-hover:border-gray-500'
                }`}
              >
                {featured === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>

              <input
                type="radio"
                name="featured"
                value={opt.value}
                checked={featured === opt.value}
                onChange={() => updateLocal({ featured: opt.value })}
                className="hidden"
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      title: 'Availability',
      open: showStock,
      setOpen: setShowStock,
      content: (
        <div className="space-y-2">
          {[
            { label: 'All Products', value: 'all' },
            { label: 'In Stock', value: '>inStock' },
            { label: 'Out of Stock', value: 'outOfStock' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`group flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 ${
                stock === opt.value
                  ? 'border-black bg-black text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  stock === opt.value
                    ? 'border-white'
                    : 'border-gray-300 group-hover:border-gray-500'
                }`}
              >
                {stock === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>

              <input
                type="radio"
                name="stock"
                value={opt.value}
                checked={stock === opt.value}
                onChange={() => updateLocal({ stock: opt.value })}
                className="hidden"
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      title: 'Size',
      open: showSize,
      setOpen: setShowSize,
      content: (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'All', value: '' },
            { label: 'XXS', value: 'XXS' },
            { label: 'XS', value: 'XS' },
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
            { label: 'L', value: 'L' },
            { label: 'XL', value: 'XL' },
            { label: 'XXL', value: 'XXL' },
            { label: 'XXXL', value: 'XXXL' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border text-xs font-medium transition-all duration-200 ${
                size === opt.value
                  ? 'border-black bg-black text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black'
              }`}
            >
              {opt.label}

              <input
                type="radio"
                name="size"
                value={opt.value}
                checked={size === opt.value}
                onChange={() => updateLocal({ size: opt.value })}
                className="hidden"
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      title: 'Color',
      open: showColor,
      setOpen: setShowColor,
      content: (
        <div className="mt-2 grid grid-cols-5 gap-3">
          {[
            { label: 'All', value: '', className: 'bg-white' },
            { label: 'Black', value: 'black', className: 'bg-black' },
            { label: 'White', value: 'white', className: 'bg-white' },
            { label: 'Gray', value: 'gray', className: 'bg-gray-400' },
            { label: 'Red', value: 'red', className: 'bg-red-500' },
            { label: 'Blue', value: 'blue', className: 'bg-blue-500' },
            { label: 'Green', value: 'green', className: 'bg-green-500' },
            { label: 'Yellow', value: 'yellow', className: 'bg-yellow-400' },
            { label: 'Brown', value: 'brown', className: 'bg-amber-800' },
            { label: 'Pink', value: 'pink', className: 'bg-pink-400' },
          ].map((opt) => (
            <label
              key={opt.value}
              title={opt.label}
              className="group flex cursor-pointer flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                  color === opt.value
                    ? 'border-black ring-2 ring-black ring-offset-2'
                    : 'border-gray-200 group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-1'
                }`}
              >
                {opt.value === '' ? (
                  <span className="relative h-full w-full overflow-hidden rounded-full bg-white">
                    <span className="absolute left-1/2 top-0 h-full w-px rotate-45 bg-gray-300" />
                  </span>
                ) : (
                  <span
                    className={`h-7 w-7 rounded-full ${opt.className} ${
                      opt.value === 'white' ? 'border border-gray-200' : ''
                    }`}
                  />
                )}
              </span>

              <span
                className={`text-[10px] ${
                  color === opt.value
                    ? 'font-semibold text-black'
                    : 'text-gray-400'
                }`}
              >
                {opt.label}
              </span>

              <input
                type="radio"
                name="color"
                value={opt.value}
                checked={color === opt.value}
                onChange={() => updateLocal({ color: opt.value })}
                className="hidden"
              />
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Filters
          </h2>

          <p className="mt-0.5 text-xs text-gray-400">Refine your selection</p>
        </div>

        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
          aria-label="Close filters"
        >
          <span className="text-2xl font-light leading-none">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-2 sm:px-8">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={`border-b border-gray-100 py-5 ${
              index === sections.length - 1 ? 'border-b-0' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => section.setOpen((value) => !value)}
              className="flex w-full items-center justify-between"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                {section.title}
              </span>

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                  section.open ? 'bg-gray-100' : ''
                }`}
              >
                <span
                  className={`h-2 w-2 rotate-45 border-r border-b border-gray-500 transition-transform duration-300 ${
                    section.open ? 'rotate-225' : ''
                  }`}
                />
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                section.open
                  ? 'mt-4 max-h-125 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white px-6 py-5 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] sm:px-8">
        <div className="flex gap-3">
          <Button onClick={resetFilters} variant="secondary" fullWidth>
            Reset
          </Button>

          <Button onClick={applyFilters} variant="primary" fullWidth>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
