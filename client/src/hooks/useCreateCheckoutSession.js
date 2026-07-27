import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createCheckoutSession } from '../services/orders';

function useCreateCheckoutSession() {
  const { mutate: checkout, isPending } = useMutation({
    mutationFn: createCheckoutSession,

    onSuccess: (data) => {
      window.location.href = data.session.url;
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    checkout,
    isLoading: isPending,
  };
}

export default useCreateCheckoutSession;
