import { useEffect, useState } from 'react';
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
  const [sort, setSort] = useState('createdAt-desc');
  const [totalResults, setTotalResults] = useState(0);

  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';

  const filtersFromUrl = {
    ...filters,
    gender,
    category,
    subcategory,
  };

  useEffect(() => {
    document.body.style.overflow = showFilter ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showFilter]);

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

  function handleFilterChange(updatedFilters) {
    const {
      gender: updatedGender,
      category: updatedCategory,
      subcategory: updatedSubcategory,
    } = updatedFilters;

    setFilters({
      priceRange: updatedFilters.priceRange,
      featured: updatedFilters.featured,
      stock: updatedFilters.stock,
      size: updatedFilters.size,
      color: updatedFilters.color,
      rating: updatedFilters.rating,
    });

    setSearchParams({
      gender: updatedGender || '',
      category: updatedCategory || '',
      subcategory: updatedSubcategory || '',
    });

    setShowFilter(false);
  }

  const pageTitle = gender
    ? `${gender} Collection`
    : category
      ? `${category} Collection`
      : 'Discover';

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-background text-foreground">
      {/* Editorial Header */}
      <section className="px-4 py-4 sm:px-8 sm:py-6  lg:px-12">
        <div className="">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            CottonEg / Collections
          </span>

          <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {pageTitle}
            </h1>

            <p className="max-w-xs text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Explore our latest styles, carefully selected for everyday comfort
              and contemporary fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Top Bar */}
      <ProductsTopBar
        count={totalResults}
        sort={sort}
        onSortChange={setSort}
        onOpenFilter={() => setShowFilter(true)}
        view={view}
        onViewChange={setView}
      />

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/50"
              onClick={() => setShowFilter(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className="fixed right-0 top-0 z-70 flex h-dvh w-[min(320px,90vw)] flex-col border-l border-border bg-background sm:w-90"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: 0.25,
                ease: 'easeInOut',
              }}
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

      {/* Products */}
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
