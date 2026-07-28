import useUpdateQuantity from './useUpdateQuantity';
import useRemoveItem from './useRemoveItem';
import { FaTrash } from 'react-icons/fa';
import IconButton from '../../ui/IconButton';

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
        <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1">
          <IconButton
            tooltip={'decrease'}
            size="sm"
            disabled={isUpdating || item.quantity === 1}
            onClick={() =>
              updateQuantity({
                itemId: item._id,
                quantity: item.quantity - 1,
              })
            }
            className="rounded-full text-gray-600 hover:bg-white hover:text-black"
          >
            −
          </IconButton>

          <span className="flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-semibold ">
            {item.quantity}
          </span>

          <IconButton
            tooltip={'increase'}
            size="sm"
            disabled={isUpdating}
            onClick={() =>
              updateQuantity({
                itemId: item._id,
                quantity: item.quantity + 1,
              })
            }
            className="rounded-full text-gray-600 hover:bg-white hover:text-black"
          >
            +
          </IconButton>

          <IconButton
            tooltip={'remove'}
            variant="danger"
            size="sm"
            disabled={isRemoving}
            onClick={() => removeItem(item._id)}
          >
            <FaTrash className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
