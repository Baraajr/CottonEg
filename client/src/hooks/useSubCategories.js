import { useQuery } from '@tanstack/react-query';
import { getSubCategories } from '../services/subCategories';

function useSubCategories({ gender = '', category = '' } = {}) {
  const {
    data: subcategories = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ['subcategories', gender, category],
    queryFn: () => getSubCategories(gender, category),
    staleTime: 5 * 60 * 1000,
  });

  return {
    subcategories,
    isPending,
    error,
  };
}

export default useSubCategories;
