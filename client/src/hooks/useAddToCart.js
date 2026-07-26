import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addProductToCart } from '../services/cart';

function useAddToCart() {
  const queryClient = useQueryClient();

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: ({ productId, variantId, quantity = 1 }) =>
      addProductToCart({ productId, variantId, quantity }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },

    onError: (err) => {
      toast.error(err?.message || 'Failed to add item');
    },
  });

  return {
    addToCart,
    isLoading: isPending,
  };
}

export default useAddToCart;
