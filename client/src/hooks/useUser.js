import { useQuery } from '@tanstack/react-query';
import { getLoggedUser } from '../services/users';

const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getLoggedUser,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false, // don't retry if not logged in
  });
};

export default useUser;
