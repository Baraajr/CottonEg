import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addProductToWishlist } from '../services/wishlist';

function useAddToWishlist() {
  const queryClient = useQueryClient();

  const { mutate: addToWishlist, isPending } = useMutation({
    mutationFn: (productId) => addProductToWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Product added to wishlist');
    },

    onError: (err) => {
      toast.error(err.message || 'Failed to add product');
    },
  });

  return { addToWishlist, isLoading: isPending };
}

export default useAddToWishlist;
