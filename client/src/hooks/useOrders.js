import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../services/orders';

function useOrders() {
  const { data, isPending, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  return {
    orders: data?.data || [],
    isPending,
    error,
  };
}

export default useOrders;
