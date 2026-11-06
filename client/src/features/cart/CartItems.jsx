import { useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from 'react-icons/fi';

import CartItem from './CartItem';
import useClearCart from './useClearCart';
import useCart from './useCart';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';

function CartItems() {
  const navigate = useNavigate();
  const { clearCart, isLoading: isClearing } = useClearCart();
  const { data, isLoading, error } = useCart();

  if (isLoading) return <Spinner />;

  if (error)
    return (
      <div className="mx-auto max-w-2xl border border-border bg-surface px-5 py-12 text-center">
        <p className="font-display text-xl text-foreground">
          Unable to load your shopping bag
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );

  const cart = data?.data || data;
  const items = cart?.cartItems || [];

  if (!items.length)
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center border border-border bg-surface px-5 py-12 text-center sm:py-16">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
          <FiShoppingBag size={25} className="text-foreground" />
        </div>

        <span className="section-label">Your shopping bag</span>

        <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
          Nothing here. Yet.
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your bag is currently empty. Explore our collection and discover
          pieces worth making your own.
        </p>

        <Button className="mt-6" onClick={() => navigate('/products')}>
          <span className="flex items-center gap-2">
            Explore collection
            <FiArrowRight size={16} />
          </span>
        </Button>
      </section>
    );

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-8">
      {/* Cart items */}
      <section className="min-w-0">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="section-label">Your selection</span>

            <h2 className="mt-1 font-display text-2xl text-foreground">
              Shopping bag
              <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
          </div>

          <button
            onClick={() => clearCart()}
            disabled={isClearing}
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Clear all
          </button>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Shopping benefits */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <FiTruck size={18} className="shrink-0 text-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Reliable delivery
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Across Egypt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiRefreshCw size={18} className="shrink-0 text-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Easy returns
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Simple return process
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiShield size={18} className="shrink-0 text-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Secure checkout
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Protected transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order summary */}
      <aside className="h-fit w-full min-w-0 border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
        <span className="section-label">Almost yours</span>

        <h2 className="mt-1 font-display text-2xl text-foreground">
          Order summary
        </h2>

        <div className="mt-6 space-y-4 border-b border-border pb-5">
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>

            <span className="font-medium text-foreground">
              {cart.totalCartPrice} EGP
            </span>
          </div>

          <div className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-right text-xs text-muted-foreground">
              Calculated at checkout
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 py-5">
          <span className="text-sm font-medium text-foreground">
            Estimated total
          </span>

          <span className="font-display text-xl font-semibold text-foreground">
            {cart.totalCartPrice} EGP
          </span>
        </div>

        <Button
          fullWidth
          disabled={isClearing || !items.length}
          onClick={() => navigate('/checkout')}
        >
          <span className="flex items-center justify-center gap-2">
            Proceed to checkout
            <FiArrowRight size={16} />
          </span>
        </Button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          Shipping and applicable taxes are calculated at checkout.
        </p>
      </aside>
    </div>
  );
}

export default CartItems;
