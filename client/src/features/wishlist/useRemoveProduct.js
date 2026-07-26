import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { removeItemFromWishlist } from '../../services/wishlist';

function useRemoveProduct() {
  const queryClient = useQueryClient();

  const { mutate: removeProduct, isPending } = useMutation({
    mutationFn: (itemId) => removeItemFromWishlist(itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },

    onError: (err) => {
      toast.error(err.message || 'Failed to remove product');
    },
  });

  return { removeProduct, isLoading: isPending };
}

export default useRemoveProduct;
