import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '../services/products';

function useProducts({
  category,
  subcategory,
  minPrice,
  maxPrice,
  page = 1,
  sort,
  gender,
  limit,
  featured,
} = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [
      'products',
      {
        category,
        subcategory,
        minPrice,
        maxPrice,
        page,
        sort,
        gender,
        limit,
        featured,
      },
    ],
    queryFn: () =>
      getFilteredProducts({
        category,
        subcategory,
        minPrice,
        maxPrice,
        page,
        sort,
        gender,
        limit,
        featured,
      }),
    keepPreviousData: true,
  });

  return { data, isLoading, error };
}

export default useProducts;
