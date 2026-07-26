import CartItem from './CartItem';
import useClearCart from './useClearCart';
import useCart from './useCart';
import Spinner from '../../ui/Spinner';

function CartItems() {
  const { clearCart, isLoading: isClearing } = useClearCart();
  const { data, isLoading, error } = useCart();

  if (isLoading) return <Spinner />;

  if (error)
    return <p className="text-center text-red-500 py-6">Failed to load cart</p>;

  const cart = data?.data || data;
  const items = cart?.cartItems || [];

  if (!items.length)
    return (
      <div className="text-center py-14">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* ITEMS */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {cart.totalCartPrice} EGP
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          disabled={isClearing}
          onClick={() => clearCart()}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Clear cart
        </button>

        <button
          disabled={isClearing || !items.length}
          className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartItems;
