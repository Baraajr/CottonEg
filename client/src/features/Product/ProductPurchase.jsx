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

  // Pick a readable check-mark color against light vs dark swatches
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

  return (
    <div className="flex flex-col">
      <h1
        className={`font-semibold tracking-tight text-gray-900 ${
          compact ? 'text-2xl' : 'text-3xl'
        }`}
      >
        {product.name}
      </h1>

      <div className="mt-4 flex items-baseline gap-3">
        <p
          className={`font-semibold tabular-nums text-gray-900 ${
            compact ? 'text-xl' : 'text-2xl'
          }`}
        >
          $
          {product.priceAfterDiscount &&
          product.priceAfterDiscount < product.price
            ? product.priceAfterDiscount
            : product.price}
        </p>

        {product.priceAfterDiscount &&
          product.priceAfterDiscount < product.price && (
            <p
              className={`tabular-nums text-gray-400 line-through ${
                compact ? 'text-sm' : 'text-base'
              }`}
            >
              ${product.price}
            </p>
          )}
      </div>
      {product.description && (
        <p
          className={`text-[15px] leading-relaxed text-gray-600 ${
            compact ? 'mt-4 line-clamp-3' : 'mt-4'
          }`}
        >
          {product.description}
        </p>
      )}

      {/* COLORS */}
      <div className={compact ? 'mt-6' : 'mt-8'}>
        <div className="mb-2.5 flex items-baseline gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Color
          </h3>
          {selectedColor && (
            <span className="text-xs text-gray-400">
              — {selectedColor.name}
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
                className={`relative h-9 w-9 rounded-full ring-1 ring-inset ring-black/10 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'ring-2 ring-gray-900 ring-offset-2'
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
                    className={`absolute inset-0 m-auto h-4 w-4 ${
                      checkDark ? 'text-gray-900' : 'text-white'
                    }`}
                    strokeWidth={2.5}
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

      {/* SIZES */}
      <div className="mt-6">
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Size
        </h3>

        <div className="flex flex-wrap gap-2">
          {availableSizes.length === 0 && (
            <span className="text-sm text-gray-400">
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
                className={`min-w-11 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* STOCK */}
      <div className="mt-5 flex items-center gap-1.5">
        {selectedVariant ? (
          <>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stockLevel === 'low' ? 'bg-amber-500' : 'bg-green-500'
              }`}
            />
            <p
              className={`text-sm ${
                stockLevel === 'low' ? 'text-amber-600' : 'text-green-600'
              }`}
            >
              {stockLevel === 'low'
                ? `Only ${selectedVariant.quantity} left in stock`
                : `${selectedVariant.quantity} in stock`}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Choose a color and size</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className={`${compact ? 'mt-6' : 'mt-10'} flex gap-3`}>
        {showWishlist && (
          <button
            type="button"
            disabled={isAddingToWishlist}
            aria-label="Add to wishlist"
            onClick={() => addToWishlist(product._id)}
            className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors duration-150 hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <FaHeart className="h-4 w-4" strokeWidth={2} />
          </button>
        )}

        <Button
          type="button"
          variant="primary"
          className="flex-1 rounded-lg"
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
          {!selectedVariant ? 'Select options' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}

export default ProductPurchase;
