import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { removeItemFromCart } from '../../services/cart';

function useRemoveItem() {
  const queryClient = useQueryClient();

  const { mutate: removeItem, isPending } = useMutation({
    mutationFn: removeItemFromCart,

    onSuccess: () => {
      // backend already returns updated cart
      queryClient.invalidateQueries(['cart']);

      toast.success('Item removed');
    },

    onError: (err) => {
      toast.error(err?.message || 'Failed to remove item');
    },
  });

  return {
    removeItem,
    isLoading: isPending,
  };
}

export default useRemoveItem;
