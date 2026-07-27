import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../services/products';

function useSearch(text) {
  return useQuery({
    queryKey: ['search', text],
    queryFn: () => searchProducts(text),
    enabled: text.trim().length > 0,
  });
}

export default useSearch;
