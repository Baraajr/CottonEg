import {
  BsGrid3X3Gap,
  BsGrid,
  BsGridFill,
  BsFilter,
  BsChevronDown,
} from 'react-icons/bs';

function ProductsTopBar({
  count = 0,
  sort,
  onSortChange,
  onOpenFilter,
  view,
  onViewChange,
}) {
  const views = [
    { value: 3, icon: BsGridFill },
    { value: 4, icon: BsGrid },
    { value: 6, icon: BsGrid3X3Gap },
  ];

  const countLabel = `${count} ${count === 1 ? 'product' : 'products'}`;

  const sortOptions = [
    ['createdAt-desc', 'Newest'],
    ['createdAt-asc', 'Oldest'],
    ['name-asc', 'Name (A–Z)'],
    ['name-desc', 'Name (Z–A)'],
    ['price-asc', 'Price: Low to High'],
    ['price-desc', 'Price: High to Low'],
    ['sold-desc', 'Best Selling'],
    ['ratingsAverage-desc', 'Top Rated'],
  ];

  const selectClass =
    'appearance-none cursor-pointer bg-transparent pr-6 text-xs text-foreground outline-none sm:text-sm';

  const filterButtonClass =
    'flex shrink-0 items-center justify-center gap-2 border border-primary bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6 sm:py-3 sm:text-sm';

  return (
    <div className="sticky top-16 z-40 w-full border-y border-border bg-background/95 px-4 py-3 backdrop-blur-xl sm:top-20 sm:px-6 sm:py-2 lg:px-10">
      {/* Mobile */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <span className="text-xs text-muted-foreground">{countLabel}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFilter}
            className="flex shrink-0 items-center gap-2 border border-border px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <BsFilter size={16} />
            Filter
          </button>

          <div className="relative flex items-center border border-border px-2.5 py-2.5">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className={`${selectClass} max-w-28.75`}
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <BsChevronDown
              size={11}
              className="pointer-events-none absolute right-2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-between sm:flex">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-foreground">
            {countLabel}
          </span>

          <div className="h-5 w-px bg-border" />

          <div className="flex items-center gap-1 border border-border bg-surface p-1">
            {views.map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onViewChange(value)}
                title={`${value} columns`}
                aria-label={`${value} columns`}
                aria-pressed={view === value}
                className={`flex h-8 w-9 items-center justify-center transition-colors ${
                  view === value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Sort by
            </span>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className={`${selectClass} w-40 font-medium`}
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <BsChevronDown
              size={12}
              className="pointer-events-none absolute right-0 text-muted-foreground"
            />
          </div>

          <button onClick={onOpenFilter} className={filterButtonClass}>
            <BsFilter size={17} />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsTopBar;
