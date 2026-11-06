import { FiTrash2 } from 'react-icons/fi';
import { HiExclamationTriangle } from 'react-icons/hi2';

import useUpdateQuantity from './useUpdateQuantity';
import useRemoveItem from './useRemoveItem';
import IconButton from '../../ui/IconButton';

function CartItem({ item }) {
  const { product, variant } = item;

  const { updateQuantity, isLoading: isUpdating } = useUpdateQuantity();
  const { removeItem, isLoading: isRemoving } = useRemoveItem();

  // Handle case where admin deleted the product
  if (!product) {
    return (
      <article className="my-2 flex items-center justify-between gap-3 border border-border bg-surface px-3 py-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground">
            <HiExclamationTriangle size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              This product is no longer available
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Please remove it from your cart to proceed.
            </p>
          </div>
        </div>

        <button
          onClick={() => removeItem(item?._id)}
          disabled={isRemoving}
          aria-label="Remove unavailable item"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
        >
          <FiTrash2 size={16} />
        </button>
      </article>
    );
  }

  const totalPrice = product.price * item.quantity;

  return (
    <article className="flex min-w-0 gap-3 py-4 sm:gap-5 sm:py-5">
      {/* Product image */}
      <div className="w-20 shrink-0 overflow-hidden border border-border bg-background sm:w-32">
        <img
          src={product.imageCover}
          alt={product.name}
          className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
        />
      </div>

      {/* Product details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 justify-between gap-2">
          <div className="min-w-0 flex-1">
            {product?.brand?.name && (
              <p className="section-label truncate text-[10px]">
                {product.brand.name}
              </p>
            )}

            <h3 className="mt-1 wrap-break-word font-display text-sm font-medium text-foreground sm:text-lg">
              {product.name}
            </h3>
          </div>

          <button
            onClick={() => removeItem(item?._id)}
            disabled={isRemoving}
            aria-label="Remove item"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
          >
            <FiTrash2 size={15} />
          </button>
        </div>

        {/* Variant */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {variant?.size && <span>Size: {variant.size}</span>}

          {variant?.size && variant?.color?.hex && (
            <span className="h-3 w-px bg-border" />
          )}

          {variant?.color?.hex && (
            <span className="flex items-center gap-2">
              Color
              <span
                className="h-3.5 w-3.5 rounded-full border border-border"
                style={{ backgroundColor: variant.color.hex }}
              />
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 sm:mt-3">
          <p className="text-[10px] text-muted-foreground sm:text-[11px]">
            {product.price} EGP × {item.quantity}
          </p>

          <p className="mt-0.5 font-display text-base font-semibold text-foreground sm:text-lg">
            {totalPrice} EGP
          </p>
        </div>

        {/* Quantity */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="text-[11px] text-muted-foreground">Quantity</span>

          <div className="flex shrink-0 items-center border border-border">
            <IconButton
              tooltip="Decrease quantity"
              size="sm"
              disabled={isUpdating || item.quantity === 1}
              onClick={() =>
                updateQuantity({
                  itemId: item._id,
                  quantity: item.quantity - 1,
                })
              }
              className="rounded-none text-foreground transition-colors hover:bg-background"
            >
              −
            </IconButton>

            <span className="min-w-8 text-center text-sm font-medium tabular-nums text-foreground">
              {item.quantity}
            </span>

            <IconButton
              tooltip="Increase quantity"
              size="sm"
              disabled={isUpdating}
              onClick={() =>
                updateQuantity({
                  itemId: item._id,
                  quantity: item.quantity + 1,
                })
              }
              className="rounded-none text-foreground transition-colors hover:bg-background"
            >
              +
            </IconButton>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
