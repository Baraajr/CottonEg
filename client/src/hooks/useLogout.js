import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['cart'] });
      navigate('/', { replace: true });
    },
  });

  return { mutate, isLoading: isPending };
}

export default useLogout;
