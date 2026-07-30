import { useNavigate } from 'react-router-dom';
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
    <div className="flex flex-col gap-6 ">
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          fullWidth
          disabled={isClearing}
          onClick={() => clearCart()}
          className="hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          Clear cart
        </Button>

        <Button
          fullWidth
          disabled={isClearing || !items.length}
          onClick={() => navigate('/checkout')}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}

export default CartItems;
