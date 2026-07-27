import { useQuery } from '@tanstack/react-query';
import { getCategoriesByGender } from '../services/category';

function useMenu(gender) {
  return useQuery({
    queryKey: ['nav', gender],
    queryFn: () => getCategoriesByGender(gender),
    enabled: !!gender,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // keep in memory 1 day
    refetchOnWindowFocus: false,
  });
}

export default useMenu;
