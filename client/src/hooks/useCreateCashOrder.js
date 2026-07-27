import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { createCashOrder } from '../services/orders';

function useCreateCashOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: ({ cartId, shippingAddress }) =>
      createCashOrder(cartId, shippingAddress),

    onSuccess: () => {
      toast.success('Order created successfully');

      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      navigate('/account/orders');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    createOrder,
    isLoading: isPending,
  };
}

export default useCreateCashOrder;
