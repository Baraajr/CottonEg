import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category';

function useCategories() {
  const {
    data: categories,
    isPending,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return {
    categories,
    isPending,
    error,
  };
}

export default useCategories;
