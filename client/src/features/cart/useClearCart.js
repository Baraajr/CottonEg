import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { clearUserCart } from '../../services/cart';

function useClearCart() {
  const queryClient = useQueryClient();

  const { mutate: clearCart, isPending } = useMutation({
    mutationFn: clearUserCart,

    onSuccess: () => {
      // safest approach for shared state
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      toast.success('Cart cleared');
    },

    onError: (err) => {
      toast.error(err?.message || 'Failed to clear cart');
    },
  });

  return { clearCart, isLoading: isPending };
}

export default useClearCart;
