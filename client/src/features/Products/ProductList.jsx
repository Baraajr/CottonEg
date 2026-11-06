import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getFilteredProducts } from '../../services/products';
import ProductCard from '../../ui/ProductCard';
import Spinner from '../../ui/Spinner';
import Pagination from './pagination';

function ProductList({ filters, sort, setTotalResults, view = 4 }) {
  const [page, setPage] = useState(1);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      sort,
    }),
    [filters, sort],
  );

  const {
    category,
    subcategory,
    priceRange,
    rating,
    gender,
    featured,
    stock,
    size,
    color,
  } = queryFilters;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryFilters, page],
    queryFn: () =>
      getFilteredProducts({
        category,
        subcategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        rating: rating > 0 ? rating : undefined,
        gender,
        sort,
        page,
        featured,
        stock,
        size,
        color,
      }),
  });

  const products = data?.data || [];
  const numberOfPages = data?.paginationResult?.numberOfPages || 1;
  const totalResults = data?.totalResults || 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [queryFilters]);

  useEffect(() => {
    setTotalResults?.(totalResults);
  }, [totalResults, setTotalResults]);

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:py-20">
        <span className="section-label">Something went wrong</span>

        <h3 className="mt-2 font-display text-2xl text-foreground">
          Unable to load products
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t load the products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-400 flex-col gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:pb-16 lg:px-10">
      {products.length > 0 ? (
        <div
          className={`grid min-w-0 items-start ${
            view === 3
              ? 'grid-cols-2 sm:grid-cols-3'
              : view === 4
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'
          } gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12`}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-y border-border py-16 text-center sm:py-24">
          <span className="section-label">The collection</span>

          <h3 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
            No products found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Try adjusting your filters or exploring another collection.
          </p>
        </div>
      )}

      {numberOfPages > 1 && (
        <div className="border-t border-border pt-2">
          <Pagination
            currentPage={page}
            numberOfPages={numberOfPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default ProductList;
