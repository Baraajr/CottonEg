import { BsGrid3X3Gap, BsGrid, BsGridFill, BsFilter } from 'react-icons/bs';

function ProductsTopBar({
  count = 0,
  sort,
  onSortChange,
  onOpenFilter,
  view,
  onViewChange,
}) {
  const iconBtn = (active) =>
    `flex items-center justify-center h-full px-3 transition ${
      active ? 'text-black' : 'text-gray-400 hover:text-black'
    }`;

  const countLabel = `${count} ${count === 1 ? 'product' : 'products'}`;

  return (
    <div className="absolut  top-20 px-2 mb-3 sticky bg-white z-40 sm:mb-5 w-full">
      {/* MOBILE ONLY */}
      <div className="flex sm:hidden items-stretch w-full border border-gray-200 rounded-md h-12">
        <div className="flex items-center px-2 flex-1 border-r border-gray-200">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full h-full text-sm text-gray-700 px-2 appearance-none focus:outline-none cursor-pointer"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>

            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>

            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>

            <option value="sold-desc">Best Selling</option>

            <option value="ratingsAverage-desc">Top Rated</option>
          </select>
        </div>

        <div className="flex-1">
          <button
            onClick={onOpenFilter}
            className="w-full h-full flex items-center justify-center gap-2 text-gray-500"
          >
            <BsFilter size={16} />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* DESKTOP ONLY */}
      <div className="hidden sm:flex items-stretch w-full border border-gray-200 rounded-md h-12">
        {/* VIEW SWITCH */}
        <div className="flex items-stretch border-r border-gray-200">
          <button
            onClick={() => onViewChange(3)}
            className={iconBtn(view === 3)}
          >
            <BsGridFill size={18} />
          </button>

          <button
            onClick={() => onViewChange(4)}
            className={iconBtn(view === 4)}
          >
            <BsGrid size={18} />
          </button>

          <button
            onClick={() => onViewChange(6)}
            className={iconBtn(view === 6)}
          >
            <BsGrid3X3Gap size={18} />
          </button>
        </div>

        {/* COUNT */}
        <div className="flex items-center justify-center flex-1 text-sm text-gray-400 border-r border-gray-200">
          {countLabel}
        </div>

        {/* SORT + FILTER */}
        <div className="flex items-stretch w-auto">
          <div className="flex items-center px-3 border-r border-gray-200 w-66">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full text-sm text-gray-700 px-2 appearance-none focus:outline-none"
            >
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>

              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>

              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>

              <option value="sold-desc">Best Selling</option>

              <option value="ratingsAverage-desc">Top Rated</option>
            </select>
          </div>

          <div className="w-32">
            <button
              onClick={onOpenFilter}
              className="w-full h-full flex items-center justify-center gap-2 text-gray-500 hover:text-black"
            >
              <BsFilter size={16} />
              <span className="text-sm">Filter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTopBar;
