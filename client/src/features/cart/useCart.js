import { useQuery } from '@tanstack/react-query';
import { getLoggedUserCart } from '../../services/cart';

function useCart({ enabled = true } = {}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getLoggedUserCart,
    enabled,
    staleTime: 1000 * 60, // 1 min cache freshness (optional but useful)
    retry: 1, // avoids spam retries on auth/network issues
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
  };
}

export default useCart;
