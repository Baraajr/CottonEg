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
    <section className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 border-b border-border pb-6">
        <span className="section-label">Discover</span>
        <h1 className="section-heading mt-2 text-3xl sm:text-4xl">
          Search Results
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Results for{' '}
          <span className="font-medium text-foreground">
            &quot;{text}&quot;
          </span>
        </p>
        {products.length > 0 && (
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'}{' '}
            found
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-70 flex-col items-center justify-center border border-border bg-surface px-5 text-center">
          <h2 className="font-display text-2xl text-foreground">
            No products found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find anything matching your search. Try another
            keyword.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Search;
