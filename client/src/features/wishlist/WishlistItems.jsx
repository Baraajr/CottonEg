import { FaRegHeart } from 'react-icons/fa';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Spinner from '../../ui/Spinner';
import useWishlist from './useWishlist';
import WishlistItem from './WishlistItem';

function WishlistItems() {
  const { data, isLoading, error } = useWishlist();

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background">
            <FiAlertCircle size={22} className="text-muted-foreground" />
          </div>

          <span className="section-label">Something went wrong</span>

          <h2 className="mt-2 font-serif text-2xl text-foreground">
            Unable to load your wishlist
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We couldn&apos;t retrieve your saved pieces. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const wishlist = data?.data || [];

  if (!wishlist.length) {
    return (
      <section className="mx-auto flex min-h-[65vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface">
          <FaRegHeart size={27} className="text-muted-foreground" />
        </div>

        <span className="section-label">Your collection</span>

        <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
          Nothing saved yet
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Keep the pieces you love close. Explore the collection and save your
          favorites here.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 border-b border-foreground pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground transition-all hover:gap-4"
        >
          Explore Collection
          <FiArrowRight size={13} />
        </Link>
      </section>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <section>
        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5 sm:mb-8 sm:pb-6">
          <div>
            <span className="section-label">Your collection</span>

            <h1 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
              Wishlist
            </h1>

            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              The pieces worth keeping.
            </p>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <FaRegHeart size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {/* Wishlist items */}
        <div className="divide-y divide-border">
          {wishlist.map((product) => (
            <WishlistItem product={product} key={product._id} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">Your saved collection</p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-foreground transition-all hover:gap-3"
          >
            Continue Shopping
            <FiArrowRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default WishlistItems;
