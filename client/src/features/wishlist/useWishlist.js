import { useQuery } from '@tanstack/react-query';
import { getLoggedUserWishlist } from '../../services/wishlist';

function useWishlist({ enabled = true } = {}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getLoggedUserWishlist,
    enabled,
    staleTime: 2000 * 60, // 1 minute cache freshness
    retry: 1,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
  };
}

export default useWishlist;
