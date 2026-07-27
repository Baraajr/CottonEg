import { useSearchParams } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import ProductCard from '../ui/ProductCard';
import Spinner from '../ui/Spinner';

function Search() {
  const [searchParams] = useSearchParams();
  const text = searchParams.get('q') || '';

  const { data, isLoading } = useSearch(text);

  if (isLoading) return <Spinner />;

  const products = data?.data || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-semibold">Results for "{text}"</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
