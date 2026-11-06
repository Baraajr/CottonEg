import { useMemo, useState } from 'react';
import { FaCheck, FaHeart } from 'react-icons/fa';

import useAddToCart from '../../hooks/useAddToCart';
import useAddToWishlist from '../../hooks/useAddToWishlist';
import Button from '../../ui/Button';

function ProductPurchase({ product, compact = false, showWishlist = true }) {
  const { addToCart, isLoading: isAddingToCart } = useAddToCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useAddToWishlist();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const variants = useMemo(() => product?.variants || [], [product]);

  const colorsWithState = useMemo(() => {
    const map = new Map();

    variants.forEach((variant) => {
      if (!variant.color) return;

      const key = variant.color.hex;
      const existing = map.get(key);

      map.set(key, {
        ...variant.color,
        disabled: variant.quantity <= 0 ? true : (existing?.disabled ?? false),
      });
    });

    return [...map.values()];
  }, [variants]);

  const availableSizes = useMemo(() => {
    if (!selectedColor) return [];

    const sizes = new Set();

    variants.forEach((variant) => {
      if (variant.quantity > 0 && variant.color?.hex === selectedColor.hex) {
        sizes.add(variant.size);
      }
    });

    return [...sizes];
  }, [variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;

    return variants.find(
      (variant) =>
        variant.color?.hex === selectedColor.hex &&
        variant.size === selectedSize &&
        variant.quantity > 0,
    );
  }, [variants, selectedColor, selectedSize]);

  const isLightColor = (hex) => {
    if (!hex) return true;

    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    return (r * 299 + g * 587 + b * 114) / 1000 > 175;
  };

  const stockLevel = selectedVariant
    ? selectedVariant.quantity <= 5
      ? 'low'
      : 'high'
    : null;

  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <div className="flex min-w-0 flex-col">
      {/* Product Heading */}
      <div className="border-b border-border pb-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          CottonEg / Collection
        </span>

        <h1
          className={`mt-3 font-display font-medium leading-tight tracking-tight text-foreground ${
            compact ? 'text-2xl' : 'text-3xl xl:text-4xl'
          }`}
        >
          {product.name}
        </h1>

        {/* Price */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p
            className={`font-medium tabular-nums text-foreground ${
              compact ? 'text-xl' : 'text-2xl'
            }`}
          >
            ${hasDiscount ? product.priceAfterDiscount : product.price}
          </p>

          {hasDiscount && (
            <>
              <p className="text-sm tabular-nums text-muted-foreground line-through">
                ${product.price}
              </p>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sale
              </span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <p
          className={`text-sm leading-6 text-muted-foreground ${
            compact ? 'mt-4' : 'mt-5'
          }`}
        >
          {product.description}
        </p>
      )}

      {/* Colors */}
      <div className={compact ? 'mt-6' : 'mt-8'}>
        <div className="mb-3 flex items-baseline gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
            Color
          </h3>

          {selectedColor && (
            <span className="text-xs text-muted-foreground">
              {selectedColor.name}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {colorsWithState.map((color) => {
            const isSelected = selectedColor?.hex === color.hex;
            const checkDark = isLightColor(color.hex);

            return (
              <button
                key={color.hex}
                type="button"
                disabled={color.disabled}
                title={color.name}
                aria-label={color.name}
                aria-pressed={isSelected}
                onClick={() => {
                  if (color.disabled) return;

                  setSelectedColor(color);
                  setSelectedSize(null);
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ring-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:scale-105'
                } ${
                  color.disabled
                    ? 'cursor-not-allowed opacity-40 saturate-50 hover:scale-100'
                    : ''
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <FaCheck
                    className={`h-3.5 w-3.5 ${
                      checkDark ? 'text-black' : 'text-white'
                    }`}
                  />
                )}

                {color.disabled && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(to top right, transparent calc(50% - 1px), rgba(0,0,0,0.5) 50%, transparent calc(50% + 1px))',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-6">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
          Size
        </h3>

        <div className="flex flex-wrap gap-2">
          {availableSizes.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Select a color to see available sizes
            </span>
          )}

          {availableSizes.map((size) => {
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedSize(size)}
                className={`flex min-w-11 items-center justify-center border px-3 py-2 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock */}
      <div className="mt-5 flex min-h-5 items-center gap-2">
        {selectedVariant ? (
          <>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stockLevel === 'low' ? 'bg-muted-foreground' : 'bg-foreground'
              }`}
            />

            <p className="text-xs text-muted-foreground">
              {stockLevel === 'low'
                ? `Only ${selectedVariant.quantity} left in stock`
                : `${selectedVariant.quantity} in stock`}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Choose a color and size
          </p>
        )}
      </div>

      {/* Actions */}
      <div className={`${compact ? 'mt-6' : 'mt-8'} flex gap-3`}>
        {showWishlist && (
          <button
            type="button"
            disabled={isAddingToWishlist}
            aria-label="Add to wishlist"
            onClick={() => addToWishlist(product._id)}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-border text-foreground transition-colors duration-200 hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaHeart className="h-4 w-4" />
          </button>
        )}

        <Button
          type="button"
          variant="primary"
          className="min-h-12 flex-1 rounded-none"
          disabled={!selectedVariant}
          loading={isAddingToCart}
          onClick={() =>
            addToCart({
              productId: product._id,
              variantId: selectedVariant._id,
              quantity: 1,
            })
          }
        >
          {!selectedVariant ? 'Select Color And Size First' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}

export default ProductPurchase;
