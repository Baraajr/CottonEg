import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category';

function useCategories({ gender = '', enabled = true } = {}) {
  const {
    data: categories = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ['categories', gender],
    queryFn: () => getCategories(gender),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    categories,
    isPending,
    error,
  };
}

export default useCategories;
