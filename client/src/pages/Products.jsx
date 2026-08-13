import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import ProductList from '../features/Products/ProductList';
import Filter from '../features/Products/Filter';
import ProductsTopBar from '../features/Products/ProductsTopBar';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: [100, 3000],
    featured: 'all',
    stock: 'all',
    size: '',
    color: '',
  });

  const [showFilter, setShowFilter] = useState(false);
  const [view, setView] = useState(4);

  const [sort, setSort] = useState('createdAt');
  const [totalResults, setTotalResults] = useState(0);

  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';

  const filtersFromUrl = {
    ...filters,
    subcategory,
    category,
    gender,
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters({
      priceRange: [100, 3000],
      featured: 'all',
      stock: 'all',
      size: '',
      color: '',
    });
  }, [gender, category, subcategory]);
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

  function handleFilterChange(updatedFilters) {
    setFilters(updatedFilters);

    setSearchParams({
      gender: updatedFilters.gender,
      category: updatedFilters.category,
      subcategory: updatedFilters.subcategory,
    });

    setShowFilter(false);
  }

  return (
    <div className="py-4">
      <div className="py-15 flex justify-center">
        <h1 className="text-4xl font-semibold uppercase tracking-[0.3em]">
          {filtersFromUrl.gender} Clothes
        </h1>
      </div>
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
              className="fixed inset-0 bg-black/40 z-60"
              onClick={() => setShowFilter(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-screen w-[320px] sm:w-90 bg-white z-60 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Filter
                filters={filtersFromUrl}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilter(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRODUCTS */}
      <ProductList
        filters={filtersFromUrl}
        sort={sort}
        view={view}
        setTotalResults={setTotalResults}
      />
    </div>
  );
}

export default Products;
