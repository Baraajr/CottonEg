import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import ProductList from '../features/Products/ProductList';
import Filter from '../features/Products/Filter';
import ProductsTopBar from '../features/Products/ProductsTopBar';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [view, setView] = useState(4);

  const [sort, setSort] = useState('createdAt');
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (showFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showFilter]);

  const filters = {
    subcategory: searchParams.get('subcategory') || '',
    category: searchParams.get('category') || '',
    priceRange: [
      Number(searchParams.get('priceGte')) || 100,
      Number(searchParams.get('priceLte')) || 3000,
    ],
    gender: searchParams.get('gender') || '',
  };

  function handleFilterChange(updatedFilters) {
    const params = {
      subcategory: updatedFilters.subcategory,
      category: updatedFilters.category,
      priceGte: updatedFilters.priceRange[0],
      priceLte: updatedFilters.priceRange[1],
    };

    // only add gender if exists
    if (updatedFilters.gender) {
      params.gender = updatedFilters.gender;
    }

    setSearchParams(params);
    setShowFilter(false);
  }

  return (
    <div className="py-4">
      {/* TOP BAR */}
      <ProductsTopBar
        count={totalResults}
        sort={sort}
        onSortChange={setSort}
        onOpenFilter={() => setShowFilter(true)}
        view={view}
        onViewChange={setView}
      />

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {showFilter && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowFilter(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-screen w-[320px] sm:w-[360px] bg-white z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Filter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilter(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRODUCTS */}
      <ProductList
        filters={filters}
        sort={sort}
        view={view}
        setTotalResults={setTotalResults}
      />
    </div>
  );
}

export default Products;
