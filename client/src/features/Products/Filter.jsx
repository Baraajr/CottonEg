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

  const optionClass = (selected) =>
    `group flex cursor-pointer items-center justify-between border px-3.5 py-2.5 text-sm transition-colors duration-200 ${
      selected
        ? 'border-foreground bg-foreground text-background'
        : 'border-border bg-background text-foreground hover:border-foreground/50 hover:bg-surface'
    }`;

  const radioIndicatorClass = (selected) =>
    `flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
      selected ? 'border-background' : 'border-muted-foreground/40'
    }`;

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
              className={optionClass(subcategory === sub._id)}
            >
              <span className="font-medium">{sub.name}</span>

              <span className={radioIndicatorClass(subcategory === sub._id)}>
                {subcategory === sub._id && (
                  <span className="h-2 w-2 rounded-full bg-background" />
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
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Minimum
              </label>

              <div className="flex items-center border border-border bg-surface px-2.5 transition-colors focus-within:border-foreground focus-within:bg-background">
                <span className="text-[10px] text-muted-foreground">EGP</span>

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
                  className="w-full min-w-0 bg-transparent px-2 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Maximum
              </label>

              <div className="flex items-center border border-border bg-surface px-2.5 transition-colors focus-within:border-foreground focus-within:bg-background">
                <span className="text-[10px] text-muted-foreground">EGP</span>

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
                  className="w-full min-w-0 bg-transparent px-2 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-xs text-muted-foreground">
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
              className={optionClass(featured === opt.value)}
            >
              <span className="font-medium">{opt.label}</span>

              <span className={radioIndicatorClass(featured === opt.value)}>
                {featured === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-background" />
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
            <label key={opt.value} className={optionClass(stock === opt.value)}>
              <span className="font-medium">{opt.label}</span>

              <span className={radioIndicatorClass(stock === opt.value)}>
                {stock === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-background" />
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
              className={`flex h-9 cursor-pointer items-center justify-center border text-xs font-medium transition-colors ${
                size === opt.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
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
        <div className="mt-1 grid grid-cols-5 gap-y-3">
          {[
            { label: 'All', value: '', className: 'bg-background' },
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                  color === opt.value
                    ? 'border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'border-border group-hover:ring-2 group-hover:ring-border group-hover:ring-offset-1'
                }`}
              >
                {opt.value === '' ? (
                  <span className="relative h-full w-full overflow-hidden rounded-full bg-background">
                    <span className="absolute left-1/2 top-0 h-full w-px rotate-45 bg-border" />
                  </span>
                ) : (
                  <span
                    className={`h-7 w-7 rounded-full ${opt.className} ${
                      opt.value === 'white' ? 'border border-border' : ''
                    }`}
                  />
                )}
              </span>

              <span
                className={`text-[10px] ${
                  color === opt.value
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
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
    <div className="flex h-dvh w-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Filters</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Refine your selection
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          aria-label="Close filters"
        >
          <span className="text-2xl font-light leading-none">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={`border-b border-border py-4 ${
              index === sections.length - 1 ? 'border-b-0' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => section.setOpen((value) => !value)}
              className="flex w-full items-center justify-between"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                {section.title}
              </span>

              <span
                className={`flex h-6 w-6 items-center justify-center transition-colors ${
                  section.open ? 'bg-surface' : ''
                }`}
              >
                <span
                  className={`h-2 w-2 rotate-45 border-b border-r border-muted-foreground transition-transform duration-300 ${
                    section.open ? 'rotate-225' : ''
                  }`}
                />
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                section.open
                  ? 'mt-3 max-h-125 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background px-5 py-4 sm:px-6">
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
