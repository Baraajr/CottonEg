import useUpdateQuantity from './useUpdateQuantity';
import useRemoveItem from './useRemoveItem';
import { FaTrash } from 'react-icons/fa';

function CartItem({ item }) {
  const { product, variant } = item;

  const { updateQuantity, isLoading: isUpdating } = useUpdateQuantity();
  const { removeItem, isLoading: isRemoving } = useRemoveItem();

  const totalPrice = product.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
      {/* IMAGE */}
      <div className="w-full sm:w-24 flex justify-center sm:justify-start">
        <img
          src={product.imageCover}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {product.name}
        </h1>

        <p className="text-sm text-gray-500">{product.brand?.name}</p>

        <p className="text-xs text-gray-500 flex items-center gap-2">
          Size: {variant?.size} | Color:
          <span
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{ backgroundColor: variant?.color?.hex }}
          />
        </p>

        <p className="text-sm font-semibold text-gray-900 mt-1">
          {item.quantity} × {product.price} EGP
        </p>

        <p className="text-sm font-bold text-gray-900">
          Total: {totalPrice} EGP
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          <button
            disabled={isUpdating || item.quantity === 1}
            onClick={() =>
              updateQuantity({
                itemId: item._id,
                quantity: item.quantity - 1,
              })
            }
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-800 disabled:opacity-40"
          >
            -
          </button>

          <p className="w-6 text-center text-sm font-medium">{item.quantity}</p>

          <button
            disabled={isUpdating}
            onClick={() =>
              updateQuantity({
                itemId: item._id,
                quantity: item.quantity + 1,
              })
            }
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-800 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          disabled={isRemoving}
          onClick={() => removeItem(item._id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition"
        >
          <FaTrash size={13} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
