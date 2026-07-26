import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateItemQuantity } from '../../services/cart';

function useUpdateQuantity() {
  const queryClient = useQueryClient();

  const { mutate: updateQuantity, isPending } = useMutation({
    mutationFn: ({ itemId, quantity }) =>
      updateItemQuantity({ itemId, quantity }),

    onSuccess: (data) => {
      // backend already returns updated cart
      queryClient.invalidateQueries(['cart']);

      toast.success('Quantity updated');
    },

    onError: (err) => {
      toast.error(err?.message || 'Failed to update quantity');
    },
  });

  return {
    updateQuantity,
    isLoading: isPending,
  };
}

export default useUpdateQuantity;
