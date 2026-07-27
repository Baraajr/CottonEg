import { useMemo, useState } from 'react';
import RatingStars from '../../ui/RatingStars';
import useAddToCart from '../../hooks/useAddToCart';
import useAddToWishlist from '../../hooks/useAddToWishlist';

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

  return (
    <div className="flex flex-col">
      <h1
        className={`font-semibold text-gray-900 ${
          compact ? 'text-2xl' : 'text-3xl'
        }`}
      >
        {product.name}
      </h1>

      <div className="mt-2">
        <RatingStars rating={product.ratingsAverage} />
      </div>

      <p
        className={`font-semibold text-gray-900 ${
          compact ? 'text-xl mt-3' : 'text-2xl mt-4'
        }`}
      >
        ${product.price}
      </p>

      {product.description && (
        <p
          className={`text-gray-600 leading-relaxed ${
            compact ? 'mt-4 line-clamp-3' : 'mt-4'
          }`}
        >
          {product.description}
        </p>
      )}

      {/* COLORS */}
      <div className={compact ? 'mt-6' : 'mt-8'}>
        <h3 className="mb-2 text-sm font-semibold text-gray-800">Color</h3>

        <div className="flex flex-wrap gap-3">
          {colorsWithState.map((color) => (
            <button
              key={color.hex}
              type="button"
              disabled={color.disabled}
              onClick={() => {
                if (color.disabled) return;

                setSelectedColor(color);
                setSelectedSize(null);
              }}
              className={`h-9 w-9 rounded-full border-2 transition ${
                selectedColor?.hex === color.hex
                  ? 'border-black'
                  : 'border-gray-300'
              } ${color.disabled ? 'cursor-not-allowed opacity-30' : ''}`}
              style={{
                backgroundColor: color.hex,
              }}
            />
          ))}
        </div>
      </div>

      {/* SIZES */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">Size</h3>

        <div className="flex flex-wrap gap-2">
          {availableSizes.length === 0 && (
            <span className="text-sm text-gray-400">Select a color first</span>
          )}

          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* STOCK */}
      <div className="mt-5">
        {selectedVariant ? (
          <p className="text-sm text-green-600">
            {selectedVariant.quantity} in stock
          </p>
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
            onClick={() => addToWishlist(product._id)}
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm transition hover:border-black"
          >
            Wishlist
          </button>
        )}

        <button
          type="button"
          disabled={!selectedVariant || isAddingToCart}
          onClick={() =>
            addToCart({
              productId: product._id,
              variantId: selectedVariant._id,
              quantity: 1,
            })
          }
          className="flex-1 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-gray-900 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-200 disabled:hover:shadow-none"
        >
          {isAddingToCart
            ? 'Adding...'
            : !selectedVariant
              ? 'Select options'
              : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductPurchase;
