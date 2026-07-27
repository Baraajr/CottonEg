import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '../../services/products';
import ProductCard from '../../ui/ProductCard';
import Spinner from '../../ui/Spinner';
import Pagination from './pagination';

function ProductList({ filters, sort, setTotalResults, view = 4 }) {
  const { category, priceRange, rating, gender, subcategory } = filters;

  const [page, setPage] = useState(1);

  const filtersKey = useMemo(() => ({ ...filters, sort }), [filters, sort]);

  const [queryKey, setQueryKey] = useState(filtersKey);

  if (JSON.stringify(queryKey) !== JSON.stringify(filtersKey)) {
    setQueryKey(filtersKey);
    setPage(1);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', queryKey, page],
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
      }),
  });

  // ✅ hooks MUST be here (before returns)
  const products = data?.data || [];
  const numberOfPages = data?.paginationResult?.numberOfPages || 1;
  const totalResults = data?.totalResults || 0;

  useEffect(() => {
    setTotalResults?.(totalResults);
  }, [totalResults, setTotalResults]);

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading products</p>;

  return (
    <div className="flex flex-col gap-5 px-2 mt-10">
      {/* Grid */}
      <div
        className={`grid gap-6 ${
          view === 3
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
            : view === 4
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        }`}
      >
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ProductList;
